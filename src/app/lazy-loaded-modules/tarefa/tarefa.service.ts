import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { FiltroTarefas } from './enums/filtro-tarefas.enum';
import { ImportanciaTarefa } from './enums/importancia-tarefa.enum';
import { Tarefa } from './tarefa.model';
import { map, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  inscricao!: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private httpClient: HttpClient) { }

  newEntity(): Tarefa {
    return {
      id: null,
      titulo: '',
      anotacoes: null,
      concluida: false,
      dataCriacao: new Date(),
      prazo: null,
      importancia: null,
      subtarefas: null,
      tags: null
    };
  }

  getTarefas(filtro?: FiltroTarefas, ordem?: string): Observable<Tarefa[]> {
    return this.httpClient.get<Tarefa[]>('assets/tarefas.json').pipe(
      map((response: Tarefa[]) => {
        if (ordem) this.ordenar(response, ordem);
        if (filtro) response = this.filtrar(response, filtro);
        return response;
      })
    );
  }

  filtrar(tarefas: Tarefa[], filtro: FiltroTarefas): Tarefa[] {
    switch (filtro) {
      case FiltroTarefas.Todas:
        return tarefas;
      case FiltroTarefas.Pendentes:
        return tarefas.filter(t => t.concluida == false);
      case FiltroTarefas.Concluidas:
        return tarefas.filter(t => t.concluida == true);
      default:
        return tarefas;
    }
  }

  ordenar(tarefas: Tarefa[], ordem: string): void {
    switch (ordem) {
      case 'alfabetica':
        tarefas.sort((a, b) => a.titulo.localeCompare(b.titulo));
        return;
      case 'dataDeCriacao':
        /* <0 → dataA vem antes de dataB
        0 → iguais
        >0 → dataA vem depois de dataB */
        tarefas.sort((a, b) => a.dataCriacao.getTime() - b.dataCriacao.getTime());
        return;
      case 'prazo':
        tarefas.sort((a, b) => {
          if (!a.prazo && !b.prazo) return 0;
          if (!a.prazo) return 1;
          if (!b.prazo) return -1;
          return a.prazo.getTime() - b.prazo.getTime();
        });
        return;
      default:
        return;
    }
  }

  save(tarefa: Tarefa, id: number | null): void {
    if (id) this.httpClient.put(`https://jsonplaceholder.typicode.com/posts/${id}`, tarefa).subscribe((answ: any) => console.log(answ));
    else this.httpClient.post(`https://jsonplaceholder.typicode.com/posts`, tarefa).subscribe((answ: any) => console.log(answ));
  }

  deleteById(id: number): void {
    this.httpClient.delete(`https://jsonplaceholder.typicode.com/posts/${id}`).subscribe((answ: any) => console.log(answ));
  }

  excluirConcluidas(): void {
    this.httpClient.delete(`https://jsonplaceholder.typicode.com/posts/concluidas`).subscribe((answ: any) => console.log(answ));
  }

  getById(id: number): Observable<Tarefa | undefined> {
    // TODO: Backend retorna a tarefa diretamente
    return this.httpClient.get<Tarefa[]>('assets/tarefas.json').pipe(
      map(tarefas => tarefas.find(t => t.id === id))
    );
  }

}
