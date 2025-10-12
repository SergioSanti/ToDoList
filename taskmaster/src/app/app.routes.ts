import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'tarefas',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/tarefas/tarefa-list/tarefa-list').then(m => m.TarefaList)
      },
      {
        path: 'nova',
        loadComponent: () => import('./components/tarefas/tarefa-form/tarefa-form').then(m => m.TarefaForm)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./components/tarefas/tarefa-form/tarefa-form').then(m => m.TarefaForm)
      }
    ]
  },
  {
    path: 'categorias',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/categorias/categoria-list/categoria-list').then(m => m.CategoriaList)
      },
      {
        path: 'nova',
        loadComponent: () => import('./components/categorias/categoria-form/categoria-form').then(m => m.CategoriaForm)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./components/categorias/categoria-form/categoria-form').then(m => m.CategoriaForm)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found').then(m => m.NotFound)
  }
];
