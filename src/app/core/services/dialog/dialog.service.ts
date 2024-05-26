import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

interface FormDialogData {
    [key: string]: any;
    model?: { [key: string]: any };
}

interface FormDialogConfig extends MatDialogConfig {
    maxWidth: string | number;
    data?: FormDialogData;
}

@Injectable({
    providedIn: 'root',
})
export class DialogService {

    constructor(private matDialog: MatDialog) { }

    /**
     * Open a form type dialog
     *
     * 1. To ensure that the form has a predefined width and is still responsive
     * the width property has been set to 100%, this makes the form take up all the available width up to the width
     * maximum set in the maxWidth property which is mandatory.
     *
     * @param component
     * @param config
     * @returns
     */
    openFormDialog<T>(component: ComponentType<T>, config: FormDialogConfig): Observable<any> {
        return this.matDialog
            .open(component, {
                data: config?.data,
                disableClose: true,
                width: '100%',
                maxHeight: '80vh',
                ...config,
            })
            .afterClosed();
    }
}
