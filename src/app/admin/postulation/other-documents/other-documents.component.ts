import { Component, EventEmitter, Input, Output, inject, input } from '@angular/core';
import FileSaver from 'file-saver';
import { FilesUpload } from '@models/files-upload';
import { Person } from '@models/persona';
import { DialogService } from '@services/dialog/dialog.service';
import { NotificationService } from '@services/notification/notification.service';
import { PostulationService } from '@services/postulation.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AlertDialogService } from '@services/confirmation/alert.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-other-documents',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './other-documents.component.html',
})
export class OtherDocumentsComponent {

  person = input<Person>();
  filesUploaded = input<FilesUpload[]>();
  documentUpload: any;
  documentName: string = "";
  urlViewer: any;
  @Output() documentsUpdated = new EventEmitter<void>();

  service = inject(PostulationService);
  notificationService = inject(NotificationService);
  dialogService = inject(DialogService);
  toastr = inject(ToastrService);
  alertDialogService = inject(AlertDialogService);

  uploadDocumentEvent(event: any) {
    this.documentUpload = event.target.files[0];
    this.documentName = this.documentUpload.name;
  }

  uploadDocument(): void {
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
    formData.append("file", this.documentUpload);
    formData.append("objectId", this.person()!.uuid);
    formData.append("objectKey", JSON.stringify(this.person()!.id));
    formData.append("objectType", "COMMON_DOCUMENT");
    formData.append("className:", this.person()!.className);
    formData.append("type:", "COMMON_DOCUMENT");
    this.service.uploadDocument(formData)
      .subscribe({
        next: (res: any) => {
          this.documentsUpdated.emit();
          this.clearUploadDocument();
          this.toastr.success('El documento se cargó correctamente');
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  deleteDocument(id: any): void {
    const dialog = this.alertDialogService.open({
      title: 'Eliminar documento!',
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
        this.handleDeleteConfirmation(id);
      }
    });
  }

  handleDeleteConfirmation(id: any): void {
    this.service.removeDocument(id)
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Eliminado correctamente!');
          this.documentsUpdated.emit();
          this.clearUploadDocument();
        },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  downloadDocument(uuid: string, fileName: string) {
    this.service.downloadDocument(uuid).subscribe({
      next: (response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        FileSaver.saveAs(blob, fileName);
      },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }

  viewDocument(urlViewer: string): void {
    this.dialogService.openFormDialog(ViewDocumentComponent, {
      maxWidth: ViewDocumentComponent.maxWidth,
      data: {
        urlViewer: urlViewer
      }
    }).subscribe({
      next:
        (resp) => { },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    })
  }

  clearUploadDocument() {
    this.documentUpload = {};
    this.documentName = "";
  }
}
