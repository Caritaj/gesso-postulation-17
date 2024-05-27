import { Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../core/services/common.service';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { PostulationService } from '../../../core/services/postulation.service';
import { TableViewComponent } from '../../../shared/table-view.component';
import { ViewRequirementsComponent } from '../../view-requirements/view-requirements.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AlertDialogService } from '../../../core/services/confirmation/alert.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-current-calls',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './current-calls.component.html',
})
export class CurrentCallsComponent extends TableViewComponent<any> implements OnInit {

  displayedColumns: string[] = [
    'puesto',
    'vacantes',
    'contratista',
    'periodo',
    'postular'
  ];

  constructor(
    injector: Injector,
    private service: PostulationService,
    private commonService: CommonService,
    override notificationService: NotificationService,
    private alertDialogService: AlertDialogService,
    private toastr: ToastrService,
    private dialogService: DialogService,
  ) {
    super(injector);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  openDialog(id: any): void {
    this.dialogService.openFormDialog(ViewRequirementsComponent, {
      maxWidth: ViewRequirementsComponent.maxWidth,
      data: {
        id: id,
        postulate: true
      }
    }).subscribe({
      next: (resp) => {
        if (resp) {
          this.loadData();
        }
      },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    })
  }

  override getListService(): Observable<any> {
    const id = this.commonService.getPersonId();
    return this.service.myWorkOffersList(id, this.getCollectionQueryParams(true));
  }
}
