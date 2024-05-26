import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'lodash-es';
import { AlertsDialogConfig } from '../../types/alerts-dialog-config';
import { AlertDialogComponent } from './dialog/alert-dialog.component';

@Injectable()
export class AlertDialogService {
    private _defaultConfig: AlertsDialogConfig = {
        title: 'Confirm action',
        message: 'Are you sure you want to confirm this action?',
        icon: {
            show: true,
            name: 'info',
            color: 'warning',
        },
        actions: {
            confirm: {
                show: true,
                label: 'Confirm',
                color: '#004e8b'
            },
            cancel: {
                show: true,
                label: 'Cancel'
            }
        },
        dismissible: false
    };
    constructor(
        private _matDialog: MatDialog
    ) { }
    open(config: AlertsDialogConfig = {}): MatDialogRef<AlertDialogComponent> {
        const userConfig = merge({}, this._defaultConfig, config);
        return this._matDialog.open(AlertDialogComponent, {
            autoFocus: false,
            disableClose: !userConfig.dismissible,
            data: userConfig
        });
    }
}
