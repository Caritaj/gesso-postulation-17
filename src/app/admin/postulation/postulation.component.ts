import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Paginated } from '@models/paginated';
import { PostulationService } from '@services/postulation.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';
import { CboModel } from '@models/cbo-model';
import { FilesUpload } from '@models/files-upload';
import { Person } from '@models/persona';
import { CommonService } from '@services/common.service';
import { NotificationService } from '@services/notification/notification.service';
import { AlertDialogService } from '@services/confirmation/alert.service';
import { HeaderComponent } from '@shared/header/header.component';
import { FooterComponent } from '@shared/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CurrentCallsComponent } from '@admin/current-calls/current-calls.component';
import { MyPostulationsComponent } from '@admin/my-postulations/my-postulations.component';
import { PersonalInformationComponent } from '@admin/register-data/personal-information/personal-information.component';
import { PersonalInformationDataBirthComponent } from '@admin/register-data/personal-information/personal-information-data-birth/personal-information-data-birth.component';
import { PersonalInformationDataUbigeoComponent } from '@admin/register-data/personal-information/personal-information-data-ubigeo/personal-information-data-ubigeo.component';
import { AcademicTrainingComponent } from '@admin/register-data/academic-training/academic-training.component';
import { TrainingComponent } from '@admin/register-data/training/training.component';
import { WorkExperienceComponent } from '@admin/register-data/work-experience/work-experience.component';
import { UploadCvComponent } from '@admin/upload-cv/upload-cv.component';
import { OtherDocumentsComponent } from '@admin/other-documents/other-documents.component';

@Component({
  selector: 'app-postulation',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    CurrentCallsComponent,
    MyPostulationsComponent,
    PersonalInformationComponent,
    PersonalInformationDataBirthComponent,
    PersonalInformationDataUbigeoComponent,
    AcademicTrainingComponent,
    TrainingComponent,
    WorkExperienceComponent,
    UploadCvComponent,
    OtherDocumentsComponent,
  ],
  templateUrl: './postulation.component.html',
  styleUrl: './postulation.component.scss'
})
export class PostulationComponent implements OnInit {

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  documentTypes!: CboModel[];
  civilStates!: CboModel[];
  genders!: CboModel[];
  licenseDrives!: CboModel[];
  departments!: CboModel[];
  provinces!: CboModel[];
  districts!: CboModel[];
  educationLevels!: CboModel[];
  capacitationType!: CboModel[];
  trainingLevel!: CboModel[];
  molType!: CboModel[];
  person!: Person;
  private sessionTimeout: number = 1200000;
  private inactiveTime: number = 0;
  filesUploaded: FilesUpload[] = [];

  isPostulationListActive = false;
  isRegisterDataUserActive = false;
  isCvUploadActive = false;
  isOtherDocumentsActive = false;

  public dialog = inject(MatDialog);
  private service = inject(PostulationService);
  public matPaginatorIntl = inject(MatPaginatorIntl);
  private notificationService = inject(NotificationService);
  private commonService = inject(CommonService);
  private alertDialogService = inject(AlertDialogService);

  ngOnInit(): void {
    this._loadData();
    this._loadListParameters();
    const token = this.commonService.getToken();
    if (token) {
      this.setupTimer();
    }
  }

  _loadData(): void {
    const personId = this.commonService.getPersonId();
    forkJoin({
      person: this.service.getInfoPersona(personId),
    }).subscribe({
      next: ({ person }) => {
        this.person = person.data;
        this._loadDocuments(this.person.uuid);
      },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }

  _loadListParameters() {
    this.service.getLisParameters().subscribe({
      next:
        (res: any) => {
          this.loadListsData(res);
        },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }

  _loadDocuments(uuid: string): void {
    this.service.getDocuments(uuid)
      .subscribe({
        next: (files: Paginated) => {
          this.filesUploaded = files.data;
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  loadListsData(data: any) {
    this.documentTypes = data.COM_IDT.items;
    this.genders = data.COM_SEX.items;
    this.licenseDrives = data.COM_TYPE_LICENCE_DRIVE.items;
    this.civilStates = data.COM_CIVILSTATUS.items;
    this.departments = data.TBL_LEVEL1.items;
    this.provinces = data.TBL_LEVEL2.items;
    this.districts = data.TBL_LEVEL3.items;
    this.educationLevels = data.COM_EDUCATION_LEVEL.items;
    this.capacitationType = data.MOL_TRANING_TYPE.items;
    this.trainingLevel = data.MOL_TRANING_LEVEL.items;
    this.molType = data.MOL_MOL_TYPE.items;
  }

  setupTimer(): void {
    this.inactiveTime = 0;
    window.addEventListener('mousemove', () => {
      this.inactiveTime = 0;
    });
    window.addEventListener('keypress', () => {
      this.inactiveTime = 0;
    });
    const timer = setInterval(() => {
      this.inactiveTime += 1000;
      if (this.inactiveTime >= this.sessionTimeout) {
        clearInterval(timer);
        this.onSessionTimeout();
      }
    }, 1000);
  }

  onDocumentsUpdated(): void {
    this._loadData();
  }

  onSessionTimeout(): void {
    this.commonService.removeSession();
    this.showSessionTimeoutModal();
  }

  showSessionTimeoutModal() {
    const dialog = this.alertDialogService.open({
      title: '¡Tu sesión ha expirado!',
      message: 'Por favor, inicia sesión nuevamente para continuar.',
      icon: { name: 'error', color: 'warning' },
      actions: {
        confirm: {
          show: true,
          label: 'Confirmar',
        },
        cancel: {
          show: false,
        },
      },
      dismissible: true,
    });

    dialog.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.reload();
      }
    });
  }

  reload(): void {
    window.location.reload();
  }

  onTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 1:
        this.isPostulationListActive = true;
        break;
      case 2:
        this.isRegisterDataUserActive = true;
        break;
      case 3:
        this.isCvUploadActive = true;
        break;
      case 4:
        this.isOtherDocumentsActive = true;
        break;
      default:
        break;
    }
  }
}
