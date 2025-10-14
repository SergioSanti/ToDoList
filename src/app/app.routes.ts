import { Routes } from '@angular/router';
import { TabelaTarefas } from './tabela-tarefas/tabela-tarefas';
import { FormTarefas } from './form-tarefas/form-tarefas';
import { ListCardTarefas } from './list-card-tarefas/list-card-tarefas';
import { TabelaCategoria } from './tabela-categoria/tabela-categoria';
import { FormCategoria } from './form-categoria/form-categoria';
import { ListCardCategoria } from './list-card-categoria/list-card-categoria';
import { PageNotFound } from './page-not-found/page-not-found';
import { Login } from './login/login';

export const routes: Routes = [
  { path: 'login', component: Login },

  // Rotas SEM guard temporariamente para teste
  { path: 'tabela', component: TabelaTarefas },
  { path: 'novo', component: FormTarefas },
  { path: 'lista', component: ListCardTarefas },
  { path: 'edit/:id', component: FormTarefas },
  
  // Rotas de Categorias
  { path: 'tabela-categoria', component: TabelaCategoria },
  { path: 'novo-categoria', component: FormCategoria },
  { path: 'lista-categoria', component: ListCardCategoria },
  { path: 'edit-categoria/:id', component: FormCategoria },

  // Redireciona para tabela se tentar acessar a raiz
  { path: '', redirectTo: '/tabela', pathMatch: 'full' },

  // Página 404
  { path: '**', component: PageNotFound }
];
