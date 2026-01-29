import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/core/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'auth/register', component: RegisterComponent
    },
    {
        path: '', redirectTo: 'auth/login', pathMatch: 'full'
    },
    {
        path: 'auth/login', component: LoginComponent
    },
    {
        path: 'dashboard', component: DashboardComponent
    }
];
