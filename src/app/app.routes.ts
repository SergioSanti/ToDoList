import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { TabelaTarefas } from './tabela-tarefas/tabela-tarefas';
import { FormTarefas } from './form-tarefas/form-tarefas';
import { ListCardTarefas } from './list-card-tarefas/list-card-tarefas';
import { TabelaCategoria } from './tabela-categoria/tabela-categoria';
import { FormCategoria } from './form-categoria/form-categoria';
import { ListCardCategoria } from './list-card-categoria/list-card-categoria';
import { PageNotFound } from './page-not-found/page-not-found';
import { Login } from './login/login';
import { authGuard } from './auth/auth-guard-guard';

/**
 * CONFIGURAÇÃO DE ROTAS - NAVEGAÇÃO SPA E SEGURANÇA
 * 
 * Este arquivo configura todas as rotas da aplicação SPA:
 * - Rotas públicas (login)
 * - Rotas protegidas com AuthGuard
 * - Parâmetros dinâmicos para edição
 * - Redirecionamentos
 * - Página 404
 * 
 */
export const routes: Routes = [
  // ROTA PÚBLICA: Login (sem proteção)
  { path: 'login', component: Login },

  // ROTAS PROTEGIDAS COM AUTHGUARD - SEGURANÇA COM TOKEN
  // Dashboard - Página Principal
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  
  // CRUD de Tarefas
  { path: 'tabela', component: TabelaTarefas, canActivate: [authGuard] },
  { path: 'novo', component: FormTarefas, canActivate: [authGuard] },
  { path: 'lista', component: ListCardTarefas, canActivate: [authGuard] },
  { path: 'edit/:id', component: FormTarefas, canActivate: [authGuard] }, // Parâmetro dinâmico
  
  // CRUD de Categorias
  { path: 'tabela-categoria', component: TabelaCategoria, canActivate: [authGuard] },
  { path: 'novo-categoria', component: FormCategoria, canActivate: [authGuard] },
  { path: 'lista-categoria', component: ListCardCategoria, canActivate: [authGuard] },
  { path: 'edit-categoria/:id', component: FormCategoria, canActivate: [authGuard] }, // Parâmetro dinâmico

  // REDIRECIONAMENTO: Rota raiz vai para dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // PÁGINA 404: Qualquer rota não encontrada
  { path: '**', component: PageNotFound }
];
