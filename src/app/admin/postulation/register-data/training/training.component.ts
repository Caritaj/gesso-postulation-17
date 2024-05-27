import { Component, Injector, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CboModel } from '../../../../core/models/cbo-model';
import { Person } from '../../../../core/models/persona';
import { CommonService } from '../../../../core/services/common.service';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PostulationService } from '../../../../core/services/postulation.service';
import { TrainingEditorComponent } from './training-editor/training-editor.component';
import { TableViewComponent } from '../../../../shared/table-view.component';
import { Training } from '../../../../core/models/training';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { AlertDialogService } from '../../../../core/services/confirmation/alert.service';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './training.component.html',
})
export class TrainingComponent extends TableViewComponent<Training> implements OnInit {
  @Input() trainingLevel!: CboModel[];
  @Input() personId!: Person;
  @Input() capacitationType!: CboModel[];

  displayedColumns: string[] = [
    'tipo',
    'nivel',
    'institucion',
    'descripcion',
    'fechaInicio',
    'fechaFin',
    'horas',
    'editar',
    'eliminar',
  ];

  constructor(
    injector: Injector,
    private service: PostulationService,
    private commonService: CommonService,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private alertDialogService: AlertDialogService,
    override notificationService: NotificationService,
  ) {
    super(injector);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  filterTrainingLevel(type: any) {
    if (this.trainingLevel) {
      let training = this.trainingLevel.filter(dis => dis.id == type);
      return training[0].text;
    }
    return '';
  }

  filterCapacitationType(type: any) {
    if (this.capacitationType) {
      let capacitation = this.capacitationType.filter(dis => dis.id == type);
      return capacitation[0].text;
    }
    return '';
  }

  override getListService(): Observable<any> {
    const id = this.commonService.getPersonId();
    return this.service.trainingList(id, this.getCollectionQueryParams(true));
  }

  openTraining(): void {
    this.dialogService.openFormDialog(TrainingEditorComponent,
      {
        maxWidth: TrainingEditorComponent.maxWidth,
        data: {
          capacitationType: this.capacitationType,
          trainingLevel: this.trainingLevel,
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
      });
  }

  editTraining(model: any): void {
    this.dialogService.openFormDialog(TrainingEditorComponent,
      {
        maxWidth: TrainingEditorComponent.maxWidth,
        data: {
          model,
          capacitationType: this.capacitationType,
          trainingLevel: this.trainingLevel
        }
      }).subscribe({
        next:
          (resp) => {
            if (resp) {
              this.loadData();
            }
          },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      })
  }

  deleteTraining(trainingId: any): void {
    const dialog = this.alertDialogService.open({
      title: 'Capacitaciones!',
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
        this.handleDeleteConfirmation(trainingId);
      }
    });
  }

  handleDeleteConfirmation(trainingId: any): void {
    this.service.trainingDelete(trainingId)
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
