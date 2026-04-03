import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('src/app/layout/shell/shell.component').then(m => m.ShellComponent),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('src/app/features/dashboard/pages/dashboard/dashboard.pages')
                        .then(m => m.DashboardComponent),
            },
        ],
    },
];