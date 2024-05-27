import { Component, Injector, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AcademicTraining } from '../../../../core/models/academic-training';
import { CboModel } from '../../../../core/models/cbo-model';
import { Person } from '../../../../core/models/persona';
import { CommonService } from '../../../../core/services/common.service';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PostulationService } from '../../../../core/services/postulation.service';
import { TableViewComponent } from '../../../../shared/table-view.component';
import { AcademicTrainingEditorComponent } from './academic-training-editor/academic-training-editor.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { AlertDialogService } from '../../../../core/services/confirmation/alert.service';

@Component({
  selector: 'app-academic-training',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './academic-training.component.html',
})
export class AcademicTrainingComponent extends TableViewComponent<AcademicTraining> implements OnInit {
  @Input() educationLevels!: CboModel[];
  @Input() personId!: Person;
  displayedColumns: string[] = [
    'grado',
    'especializacion',
    'centro',
    'inicio',
    'fin',
    'editar',
    'eliminar',
  ];

  constructor(
    injector: Injector,
    private service: PostulationService,
    private commonService: CommonService,
    private dialogService: DialogService,
    override notificationService: NotificationService,
    private toastr: ToastrService,
    private alertDialogService: AlertDialogService,
  ) {
    super(injector);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override getListService(): Observable<any> {
    const id = this.commonService.getPersonId();
    return this.service.academicTrainingList(id, this.getCollectionQueryParams(true));
  }

  filterEducationLevels(type: any) {
    if (this.educationLevels) {
      const education = this.educationLevels.filter(dis => dis.id == type);
      return education[0].text;
    }
    return '';
  }

  editAcademicTraining(model: any): void {
    this.dialogService.openFormDialog(AcademicTrainingEditorComponent,
      {
        maxWidth: AcademicTrainingEditorComponent.maxWidth,
        data: {
          model,
          educationLevels: this.educationLevels,
        }
      }).subscribe({
        next: (resp) => {
          if (resp) {
            this.loadData()
          }
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      })
  }

  deleteAcademicTraining(academicTrainingId: any): void {
    const dialog = this.alertDialogService.open({
      title: 'Formación Académica!',
      message: '¿Está seguro que desea eliminar el registro?',
      icon: { name: 'error', color: 'error' },
      actions: {
        confirm: {
          show: true,
          label: 'Confirmar',
        },
        cancel: {
          show: true,
          label: 'Cancelar',
        },
      },
      dismissible: true,
    });

    dialog.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.handleDeleteConfirmation(academicTrainingId);
      }
    });
  }

  handleDeleteConfirmation(academicTrainingId: any): void {
    this.service.academicTrainingDelete(academicTrainingId)
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Eliminado correctamente!');
          this.loadData();
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }


  openAcademicTraining(): void {
    this.dialogService.openFormDialog(AcademicTrainingEditorComponent, {
      maxWidth: AcademicTrainingEditorComponent.maxWidth,
      data: {
        educationLevels: this.educationLevels,
        personId: this.personId.id,
      }
    }).subscribe({
      next: (resp: any) => {
        if (resp) {
          this.loadData();
        }
      },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }
}
