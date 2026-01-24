import { Pipe, PipeTransform } from '@angular/core';
import { ImportanciaTarefa } from './importancia-tarefa.enum';

@Pipe({
  name: 'importanciaTarefa'
})
export class ImportanciaTarefaPipe implements PipeTransform {

  private labels: Record<number, string> = {
    [ImportanciaTarefa.Baixa]: 'Baixa',
    [ImportanciaTarefa.Media]: 'Média',
    [ImportanciaTarefa.Alta]: 'Alta'
  };

  transform(value: ImportanciaTarefa | number): string {
    // Se vier um enum, pega o valor numérico
    const numericValue = typeof value === 'number' ? value : value as number;
    return this.labels[numericValue] ?? 'Desconhecida';
  }

}
