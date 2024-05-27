import { Component, Injector, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CboModel } from '../../../../core/models/cbo-model';
import { Person } from '../../../../core/models/persona';
import { CommonService } from '../../../../core/services/common.service';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PostulationService } from '../../../../core/services/postulation.service';
import { WorkExperienceEditorComponent } from './work-experience-editor/work-experience-editor.component';
import { WorkExperience } from '../../../../core/models/work-experience';
import { TableViewComponent } from '../../../../shared/table-view.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { AlertDialogService } from '../../../../core/services/confirmation/alert.service';

@Component({
  selector: 'app-work-experience',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './work-experience.component.html',
})
export class WorkExperienceComponent extends TableViewComponent<WorkExperience> implements OnInit {
  @Input() molType!: CboModel[];
  @Input() personId!: Person;

  displayedColumns: string[] = [
    'contratista',
    'area',
    'puesto',
    'fechaInicio',
    'fechaFin',
    'empleoActual',
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
    return this.service.workExperienceList(id, this.getCollectionQueryParams(true));
  }

  openWorkExperience(): void {
    this.dialogService.openFormDialog(WorkExperienceEditorComponent, {
      maxWidth: WorkExperienceEditorComponent.maxWidth,
      data: {
        molType: this.molType,
        personId: this.personId.id,
      }
    }).subscribe({
      next: (resp) => {
        if (resp) {
          this.loadData();
        }
      },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    })
  }

  editWorkExperience(model: any): void {
    this.dialogService.openFormDialog(WorkExperienceEditorComponent, {
      maxWidth: WorkExperienceEditorComponent.maxWidth,
      data: {
        model,
        molType: this.molType,
        personId: this.personId.id,
      }
    }).subscribe({
      next: (resp) => {
        if (resp) {
          this.loadData();
        }
      },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    })
  }

  deleteWorkExperience(workExperienceId: any): void {
    const dialog = this.alertDialogService.open({
      title: 'Experiencia laboral!',
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
        this.handleDeleteConfirmation(workExperienceId);
      }
    });
  }

  handleDeleteConfirmation(workExperienceId: any): void {
    this.service.workExperienceDelete(workExperienceId)
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
}
