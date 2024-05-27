import { Routes } from '@angular/router';
import { HomeComponent } from './admin/home/home.component';
import { NoAuthGuard } from './core/guards/no-auth-guard';
import { CurrentAnnouncementComponent } from './admin/home/current-announcement/current-announcement.component';
import { HistoryAnnouncementComponent } from './admin/home/history-announcement/history-announcement.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [NoAuthGuard] },
    {
        path: '',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    { path: '**', redirectTo: '' },
    { path: 'current-announcement', component: CurrentAnnouncementComponent },
    { path: 'history-announcement', component: HistoryAnnouncementComponent }
];
