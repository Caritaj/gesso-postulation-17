import { Component, OnInit, ViewChild } from '@angular/core';
import { Paginated } from '../../core/models/paginated';
import { PostulationService } from '../../core/services/postulation.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';
import { CboModel } from '../../core/models/cbo-model';
import { FilesUpload } from '../../core/models/files-upload';
import { Person } from '../../core/models/persona';
import { CommonService } from '../../core/services/common.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { AlertDialogService } from '../../core/services/confirmation/alert.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CurrentCallsComponent } from './current-calls/current-calls.component';
import { MyPostulationsComponent } from './my-postulations/my-postulations.component';
import { PersonalInformationComponent } from './register-data/personal-information/personal-information.component';
import { PersonalInformationDataBirthComponent } from './register-data/personal-information/personal-information-data-birth/personal-information-data-birth.component';
import { PersonalInformationDataUbigeoComponent } from './register-data/personal-information/personal-information-data-ubigeo/personal-information-data-ubigeo.component';
import { AcademicTrainingComponent } from './register-data/academic-training/academic-training.component';
import { TrainingComponent } from './register-data/training/training.component';
import { WorkExperienceComponent } from './register-data/work-experience/work-experience.component';
import { UploadCvComponent } from './upload-cv/upload-cv.component';
import { OtherDocumentsComponent } from './other-documents/other-documents.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-postulation',
  standalone: true,
  imports: [
    CommonModule,
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

  constructor(
    public dialog: MatDialog,
    private service: PostulationService,
    public matPaginatorIntl: MatPaginatorIntl,
    private notificationService: NotificationService,
    private commonService: CommonService,
    private alertDialogService: AlertDialogService,
  ) { }

  ngOnInit(): void {
    this._loadData();
    this._loadListParameters();
    const token = this.commonService.getToken();
    if (token) {
      this.setupTimer();
    }
  }

  _loadData() {
    const personId = this.commonService.getPersonId();
    forkJoin([
      this.service.getInfoPersona(personId),
    ]).subscribe(
      ([person]) => {
        this.person = person.data;
        this._loadDocuments(this.person.uuid);
      },
      (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    );
  }

  _loadListParameters() {
    this.service.getListparameters().subscribe((res: any) => {
      this.loadListsData(res);
    }, (xhr: any) => {
      this.notificationService.handleXhrError(xhr);
    });
  }

  _loadDocuments(uuid: string): void {
    this.service.getDocuments(uuid).subscribe(
      (files: Paginated) => {
        this.filesUploaded = files.data;
      },
      (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    );
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
    window.onmousemove = (): void => {
      this.inactiveTime = 0;
    };
    window.onkeypress = (): void => {
      this.inactiveTime = 0;
    };
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
