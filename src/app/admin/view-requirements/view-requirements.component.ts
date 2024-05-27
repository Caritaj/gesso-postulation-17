import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostulationService } from '../../core/services/postulation.service';
import { CommonService } from '../../core/services/common.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { Paginated } from '../../core/models/paginated';
import { AlertDialogService } from '../../core/services/confirmation/alert.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogFormatModule } from '../../shared/dialog-format.module';

@Component({
  selector: 'app-view-requirements',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    DialogFormatModule,
  ],
  templateUrl: './view-requirements.component.html',
  styleUrl: './view-requirements.component.scss'
})
export class ViewRequirementsComponent implements OnInit {

  public static readonly maxWidth: number = 12 * 80 + 44;
  workOffers: any = {};
  viewPostulate!: boolean;

  constructor(public dialogRef: MatDialogRef<ViewRequirementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: PostulationService,
    private commonService: CommonService,
    private notificationService: NotificationService,
    private alertDialogService: AlertDialogService,
  ) { }

  ngOnInit(): void {
    this.viewPostulate = this.data.postulate;
    this.getWorkOffers();
  }

  closeModal(message: any): void {
    this.dialogRef.close(message);
  }

  getWorkOffers() {
    this.service.getWorkOffers(this.data.id)
      .subscribe({
        next:
          (paginated: Paginated) => {
            this.workOffers = paginated.data;
          },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  zeroPad(num: any, places: any): string {
    return String(num).padStart(places, '0');
  }

  savePostulation() {
    const dialog = this.alertDialogService.open({
      title: 'Postulación',
      message: '¿Está seguro que desea postular a este empleo?',
      icon: { name: 'error', color: 'warning' },
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
        this.handleSaveConfirmation();
      }
    });
  }

  handleSaveConfirmation(): void {
    let personId = this.commonService.getPersonId();
    this.service.savePostulation(personId, this.data.id).subscribe({
      next: (_) => {
        this.showSuccessDialog('La postulación se realizó correctamente');
      },
      error: (err) => {
        this.showErrorDialog(err.error.message);
      }
    });
  }

  showSuccessDialog(message: string): void {
    this.alertDialogService.open({
      title: 'Hecho',
      message,
      icon: { name: 'check_circle', color: 'success' },
      actions: {
        confirm: {
          show: false,
          label: 'Confirmar',
        },
        cancel: {
          show: false,
          label: 'Cancelar',
        },
      },
      dismissible: true,
    });
  }
  showErrorDialog(errorMessage: string): void {
    this.alertDialogService.open({
      title: 'Error',
      message: errorMessage,
      icon: { name: 'error', color: 'error' },
      actions: {
        confirm: {
          show: false,
          label: 'Confirmar',
        },
        cancel: {
          show: false,
          label: 'Cancelar',
        },
      },
      dismissible: true,
    });
  }
}
