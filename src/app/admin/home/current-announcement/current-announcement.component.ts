import { Component, Injector, OnInit } from '@angular/core';
import { Announcement } from '../../../core/models/announcement';
import { TableViewComponent } from '../../../shared/table-view.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PostulationService } from '../../../core/services/postulation.service';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { DialogService } from '../../../core/services/dialog/dialog.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostulationFiltersComponent } from './postulation-filters/postulation-filters.component';
import { MatTableModule } from '@angular/material/table';
import { ViewRequirementsComponent } from '../../view-requirements/view-requirements.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-current-announcement',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    PostulationFiltersComponent,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './current-announcement.component.html',
})
export class CurrentAnnouncementComponent extends TableViewComponent<Announcement> implements OnInit {
  displayedColumns: string[] = [
    'position',
    'vacancies',
    'requirements',
    'contractor',
    'period'
  ];

  constructor(
    injector: Injector,
    private router: Router,
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
    return this.service.getOffers(this.getCollectionQueryParams());
  }

  postulate() {
    this.router.navigate(['/login']);
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
