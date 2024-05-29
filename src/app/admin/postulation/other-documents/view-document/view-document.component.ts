import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogFormatModule } from '@shared/dialog-format.module';

@Component({
  selector: 'app-view-document',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    DialogFormatModule,
  ],
  templateUrl: './view-document.component.html',
})
export class ViewDocumentComponent implements OnInit {
  public static readonly maxWidth: number = 12 * 80 + 44;
  urlViewer: any;

  constructor(public dialogRef: MatDialogRef<ViewDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.urlViewer = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.urlViewer);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
