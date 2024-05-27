import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostulationService } from '../../../core/services/postulation.service';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { TableViewComponent } from '../../../shared/table-view.component';
import { Observable } from 'rxjs';
import { ViewRequirementsComponent } from '../../view-requirements/view-requirements.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { PostulationFiltersStateComponent } from './postulation-filters-state/postulation-filters-state.component';

@Component({
  selector: 'app-history-announcement',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    PostulationFiltersStateComponent,
  ],
  templateUrl: './history-announcement.component.html',
  styleUrl: './history-announcement.component.scss'
})
export class HistoryAnnouncementComponent extends TableViewComponent<any> implements OnInit {

  displayedColumns: string[] = [
    'position',
    'vacancies',
    'requirements',
    'contractor',
    'period'
  ];

  constructor(
    injector: Injector,
    public dialog: MatDialog,
    private service: PostulationService,
    public matPaginatorIntl: MatPaginatorIntl,
    override notificationService: NotificationService,
    private dialogService: DialogService,
  ) {
    super(injector);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override getListService(): Observable<any> {
    return this.service.getOffersHistory(this.getCollectionQueryParams());
  }

  openDialog(id: any): void {
    this.dialogService.openFormDialog(ViewRequirementsComponent, {
      maxWidth: ViewRequirementsComponent.maxWidth,
      data: {
        id: id,
        postulate: false,
      }
    }).subscribe({
      next: (_) => { },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }
}