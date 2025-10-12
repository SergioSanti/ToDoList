import { Routes } from '@angular/router';
import { TabelaTarefas } from './tabela-tarefas/tabela-tarefas';
import { FormTarefas } from './form-tarefas/form-tarefas';
import { ListCardTarefas } from './list-card-tarefas/list-card-tarefas';
import { PageNotFound } from './page-not-found/page-not-found';
import { Login } from './login/login';
import { authGuard } from './auth/auth-guard-guard';

export const routes: Routes = [
  { path: 'login', component: Login },

  // Rotas protegidas (só acessa se estiver logado)
  { path: 'tabela', component: TabelaTarefas, canActivate: [authGuard] },
  { path: 'novo', component: FormTarefas, canActivate: [authGuard] },
  { path: 'lista', component: ListCardTarefas, canActivate: [authGuard] },
  { path: 'edit/:id', component: FormTarefas, canActivate: [authGuard] },

  // Redireciona para login se tentar acessar a raiz
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Página 404
  { path: '**', component: PageNotFound }
];
