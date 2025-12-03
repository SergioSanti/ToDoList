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
 * ROUTE CONFIGURATION - SPA NAVIGATION AND SECURITY
 * 
 * This file configures all application SPA routes:
 * - Public routes (login)
 * - Protected routes with AuthGuard
 * - Dynamic parameters for editing
 * - Redirects
 * - 404 page
 * 
 */
export const routes: Routes = [
  // PUBLIC ROUTE: Login (no protection)
  { path: 'login', component: Login },

  // PROTECTED ROUTES WITH AUTHGUARD - TOKEN SECURITY
  // Dashboard - Main Page
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  
  // CRUD for Tasks
  { path: 'tabela', component: TabelaTarefas, canActivate: [authGuard] },
  { path: 'novo', component: FormTarefas, canActivate: [authGuard] },
  { path: 'lista', component: ListCardTarefas, canActivate: [authGuard] },
  { path: 'edit/:id', component: FormTarefas, canActivate: [authGuard] }, // Dynamic parameter
  
  // CRUD for Categories
  { path: 'tabela-categoria', component: TabelaCategoria, canActivate: [authGuard] },
  { path: 'novo-categoria', component: FormCategoria, canActivate: [authGuard] },
  { path: 'lista-categoria', component: ListCardCategoria, canActivate: [authGuard] },
  { path: 'edit-categoria/:id', component: FormCategoria, canActivate: [authGuard] }, // Dynamic parameter

  // REDIRECT: Root route goes to dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // 404 PAGE: Any route not found
  { path: '**', component: PageNotFound }
];
