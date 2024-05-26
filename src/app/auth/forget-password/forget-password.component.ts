import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogFormatModule } from '../../shared/dialog-format.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTabsModule,
    DialogFormatModule,
  ],
  templateUrl: './forget-password.component.html',
})
export class ForgetPasswordComponent {
  public static readonly maxWidth: number = 7 * 80 + 44;

  constructor(public dialogRef: MatDialogRef<ForgetPasswordComponent>,) { }
  
  close(): void {
    this.dialogRef.close();
  }
}
