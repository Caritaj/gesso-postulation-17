import { Component } from '@angular/core';
import { HeaderComponent } from '@shared/header/header.component';
import { FooterComponent } from '@shared/footer/footer.component';
import { CurrentAnnouncementComponent } from './current-announcement/current-announcement.component';
import { HistoryAnnouncementComponent } from './history-announcement/history-announcement.component';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CurrentAnnouncementComponent,
    HistoryAnnouncementComponent,
    MatTabsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  activeTab = false

  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 1) {
      this.activeTab = true;
    }
  }
}
