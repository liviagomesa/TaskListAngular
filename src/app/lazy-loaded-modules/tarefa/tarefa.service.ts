import { Injectable } from '@angular/core';
import { Tarefa } from './tarefa.types';
import { filter, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseService } from 'src/app/shared/base-service/base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarefaService extends BaseService<Tarefa> {

  endpoint = 'tarefas';

  override create(formValue: Tarefa): Observable<Tarefa> {
    // Primeiro criamos a tarefa
    return this.http.post<Tarefa>(this.baseUrl, formValue).pipe(

      // Depois criamos as subtarefas e tags
      switchMap((t: Tarefa) => {

        // Array onde vamos guardar o valor emitido por cada post
        const ops: Observable<any>[] = [];

        // Para cada tag do formulário, cria um POST novo
        (formValue.tags ?? []).forEach(tag => {
          ops.push(
            this.http.post(`${environment.apiUrl}/tags`, { ...tag, id: undefined, tarefaId: t.id })
          );
        });

        // Para cada subtarefa do formulário, cria um POST novo
        (formValue.subtarefas ?? []).forEach(sub => {
          ops.push(
            this.http.post(`${environment.apiUrl}/subtarefas`, { ...sub, id: undefined, tarefaId: t.id })
          );
        });

        // Se não tiver filhos, já retorna a tarefa
        if (ops.length === 0) return of(t);

        // Se tiver algo para criar, forkJoin espera TODOS os POSTs terminarem e emite um array com todas as tags e subtarefas criadas
        return forkJoin(ops).pipe(
          map(() => t) // em vez de retornar o array, retorna a tarefa
        );

      })
    );
  }

  override update(formValue: Tarefa, id: number): Observable<Tarefa> {

    // como estamos usando json-server, é necessário excluir tudo e recriar depois
    return this.deleteById(id).pipe(
      switchMap(() => this.create(formValue))
    );

  }

  override deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}?_dependent=subtarefas,tags`);
  }

  excluirConcluidas(): Observable<void[] | null> {
    return this.findConcluidas().pipe(
      switchMap(tarefas => {
        // Se não houver tarefas, retorne um Observable de 'null' imediatamente
        if (tarefas.length === 0) return of(null);

        return forkJoin( // 3. encapsula todos os observables, espera TODOS terminarem e emite UM array com todos os resultados
          tarefas.map(t => // 1. para cada tarefa concluída
            this.deleteById(t.id!)) // 2. exclui e emite Observable<void> (se está no banco, com certeza tem id)
        )
      })
    );
  }

  findByIdWithEmbed(id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.baseUrl}/${id}?_embed=subtarefas&_embed=tags`);
  }

  // TODO: Alterar para PATCH, enviando somente o campo alterado
  toggleConclusaoById(id: number): Observable<Tarefa> {
    return this.findById(id).pipe(
      filter(obj => this.isDto(obj)), // garante que não prossiga se for undefined
      map((t: Tarefa) => { return { ...t, concluida: !t.concluida } }),
      switchMap(t => this.update(t, id))
    );
  }

  findConcluidas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.baseUrl}?concluida=true`);
  }

  countConcluidas(): Observable<number> {
    const params = new HttpParams()
    .set('concluida', true)
    .set('_per_page', '1').set('_page', 1);      // O header X-Total-Count só é enviado pelo json-server quando você usa os parâmetros de paginação

    return this.http.get<Tarefa[]>(this.baseUrl, {
        params,
        observe: 'response'
      }
    ).pipe(
      map(resp => Number(resp.headers.get('X-Total-Count')) || 0)
    );
  }

}
