import { Injectable } from '@angular/core';
import { Categoria } from './categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private proxId = 3;
  listaCategorias: Categoria[] = [
    { id: 1, nome:'Trabalho', descricao:'Tarefas relacionadas ao trabalho', cor:'#007bff' },
    { id: 2, nome:'Pessoal', descricao:'Tarefas pessoais', cor:'#28a745' }
  ];

  inserir(categoria: Categoria){
    categoria.id = this.proxId++;
    this.listaCategorias.push(categoria);
  }  

  listar(): Categoria[] {
    return this.listaCategorias;
  }

  buscarPorId(id?: number): Categoria | undefined {
    const categoria = this.listaCategorias.find(c => c.id === id);
    return categoria ? {...categoria} : undefined;
  }

  editar(id: number, categoria: Categoria) {
    const indice = this.getIndice(id);
    if(indice >= 0) {
      this.listaCategorias[indice] = categoria;
    }
  }

  deletar(id?: number) {
    const indice = this.getIndice(id);
    if(indice >=0){
      this.listaCategorias.splice(indice, 1);
    }
  }

  private getIndice(id?: number) {
    return this.listaCategorias.findIndex(c => c.id === id);
  }
}
