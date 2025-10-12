import { Routes } from '@angular/router';
import { TabelaTarefas } from './tabela-tarefas/tabela-tarefas';
import { FormTarefas } from './form-tarefas/form-tarefas';
import { ListCardTarefas } from './list-card-tarefas/list-card-tarefas';
import { PageNotFound } from './page-not-found/page-not-found';

export const routes: Routes = [
    { path: 'tabela', component: TabelaTarefas },       // Página com tabela de tarefas
    { path: 'novo', component: FormTarefas },           // Página para criar nova tarefa
    { path: 'lista', component: ListCardTarefas },      // Página com cards das tarefas
    { path: 'edit/:id', component: FormTarefas },       // Página para editar tarefa existente
    { path: '', redirectTo: '/lista', pathMatch: 'full'}, // Redireciona para lista ao acessar raiz
    { path: '**', component: PageNotFound }             // Página 404 para rotas inválidas
];
