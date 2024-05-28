import { Routes } from '@angular/router';
import { HomeComponent } from './admin/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    }
];
