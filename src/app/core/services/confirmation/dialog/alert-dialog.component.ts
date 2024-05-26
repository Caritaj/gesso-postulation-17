import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AlertsDialogConfig } from '../../../types/alerts-dialog-config';

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule
    ]
})
export class AlertDialogComponent implements OnInit {
    defaultConfirmColor: string = '#004e8b';
    
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: AlertsDialogConfig,
        public matDialogRef: MatDialogRef<AlertDialogComponent>
    ) {}

    ngOnInit(): void {
        if (this.data.actions?.confirm?.show && !this.data.actions.confirm.color) {
            this.data.actions.confirm.color = this.defaultConfirmColor;
        }
    }
}
