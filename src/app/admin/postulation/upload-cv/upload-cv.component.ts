import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Person } from '@models/persona';
import { NotificationService } from '@services/notification/notification.service';
import { PostulationService } from '@services/postulation.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import * as FileSaver from 'file-saver';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { AlertDialogService } from '@services/confirmation/alert.service';

@Component({
  selector: 'app-upload-cv',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './upload-cv.component.html',
})
export class UploadCvComponent {
  person = input<Person>();
  fileBlob: any;
  fileUpload: any;
  fileName: string = "";
  @Output() documentsUpdated = new EventEmitter<void>();

  private service = inject(PostulationService);
  private sanitizer = inject(DomSanitizer);
  private toastr = inject(ToastrService);
  private alertDialogService = inject(AlertDialogService);
  private notificationService = inject(NotificationService);

  uploadFileEvent(event: any) {
    this.fileUpload = event.target.files[0];
    this.fileName = this.fileUpload.name;
  }

  uploadFile(): void {
    const dialog = this.alertDialogService.open({
      title: 'Adjuntar documento!',
      message: '¿Está seguro que desea cargar el documento?',
      icon: { name: 'help', color: 'info' },
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
        this.handleUploadConfirmation();
      }
    });
  }

  handleUploadConfirmation(): void {
    const formData = new FormData();
    formData.append("file", this.fileUpload);
    formData.append("objectId", this.person()!.uuid);
    formData.append("objectKey", JSON.stringify(this.person()!.id));
    formData.append("objectType", "PERSON");
    formData.append("className:", this.person()!.className);
    formData.append("type:", "COMMON_DOCUMENT");
    this.service.uploadCV(formData)
      .subscribe({
        next: (res: any) => {
          this.documentsUpdated.emit();
          this.clearUploadFile();
          this.toastr.success('El documento se cargó correctamente');
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  downloadFile() {
    this.service.downloadCV(this.person()!.cvId)
      .subscribe({
        next: (response: any) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          FileSaver.saveAs(blob, this.person()!.numdoc + "_CV.pdf");
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  viewFile() {
    this.service.downloadCV(this.person()!.cvId)
      .subscribe({
        next: (response: any) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const fileUrl = URL.createObjectURL(blob);
          this.fileBlob = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  clearUploadFile() {
    this.fileUpload = {};
    this.fileName = "";
  }
}
