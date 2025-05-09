import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'welcome',
        loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent)
      },
      {
        path: 'user-management',
        loadComponent: () => import('./pages/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'employee',
        loadComponent: () => import('./pages/employee/employee.component').then(m => m.EmployeeComponent)
      },
      {
        path: 'cuti',
        loadComponent: () => import('./pages/cuti/cuti.component').then(m => m.CutiComponent)
      },

    ]
  },
];
