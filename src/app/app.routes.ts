import { Routes } from '@angular/router';
import { TabelaTarefas } from './tabela-tarefas/tabela-tarefas';
import { FormTarefas } from './form-tarefas/form-tarefas';
import { ListCardTarefas } from './list-card-tarefas/list-card-tarefas';
import { TabelaCategoria } from './tabela-categoria/tabela-categoria';
import { FormCategoria } from './form-categoria/form-categoria';
import { ListCardCategoria } from './list-card-categoria/list-card-categoria';
import { PageNotFound } from './page-not-found/page-not-found';
import { Login } from './login/login';
import { authGuard } from './auth/auth-guard-guard';

export const routes: Routes = [
  { path: 'login', component: Login },

  // Rotas protegidas com AuthGuard
  { path: 'tabela', component: TabelaTarefas, canActivate: [authGuard] },
  { path: 'novo', component: FormTarefas, canActivate: [authGuard] },
  { path: 'lista', component: ListCardTarefas, canActivate: [authGuard] },
  { path: 'edit/:id', component: FormTarefas, canActivate: [authGuard] },
  
  // Rotas de Categorias protegidas
  { path: 'tabela-categoria', component: TabelaCategoria, canActivate: [authGuard] },
  { path: 'novo-categoria', component: FormCategoria, canActivate: [authGuard] },
  { path: 'lista-categoria', component: ListCardCategoria, canActivate: [authGuard] },
  { path: 'edit-categoria/:id', component: FormCategoria, canActivate: [authGuard] },

  // Redireciona para tabela se tentar acessar a raiz
  { path: '', redirectTo: '/tabela', pathMatch: 'full' },

  // Página 404
  { path: '**', component: PageNotFound }
];
