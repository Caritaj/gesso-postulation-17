import { NgModule } from '@angular/core';
import { DialogActionsComponent } from './dialog-actions/dialog-actions.component';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { DialogHeaderComponent } from './dialog-header/dialog-header.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        MatIconModule,
    ],
    declarations: [
        DialogActionsComponent,
        DialogContentComponent,
        DialogHeaderComponent,
    ],
    exports: [
        DialogActionsComponent,
        DialogContentComponent,
        DialogHeaderComponent,
        MatIconModule,
    ]
})
export class DialogFormatModule { }
