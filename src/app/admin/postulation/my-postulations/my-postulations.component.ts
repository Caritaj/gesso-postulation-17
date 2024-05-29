import { Component, Injector, OnInit } from '@angular/core';
import { TableViewComponent } from '@shared/table-view.component';
import { Observable } from 'rxjs';
import { CommonService } from '@services/common.service';
import { NotificationService } from '@services/notification/notification.service';
import { PostulationService } from '@services/postulation.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AlertDialogService } from '@services/confirmation/alert.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-postulations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './my-postulations.component.html',
})
export class MyPostulationsComponent extends TableViewComponent<any> implements OnInit {

  displayedColumns: string[] = [
    'puesto',
    'contratista',
    'fecha',
    'estado',
    'eliminar'
  ];

  constructor(
    injector: Injector,
    private service: PostulationService,
    private commonService: CommonService,
    override notificationService: NotificationService,
    private toastr: ToastrService,
    private alertDialogService: AlertDialogService,
  ) {
    super(injector);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  deletePostulation(id: any): void {
    const dialog = this.alertDialogService.open({
      title: 'Postulación!',
      message: '¿Está seguro que desea eliminar la postulación al empleo?',
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
        this.handleDeleteConfirmation(id);
      }
    });
  }

  handleDeleteConfirmation(id: any): void {
    this.service.deletePostulation(id)
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

  override getListService(): Observable<any> {
    const id = this.commonService.getPersonId();
    return this.service.postulationList(id, this.getCollectionQueryParams(true));
  }
}
