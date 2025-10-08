import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diasDesde'
})
export class DiasDesdePipe implements PipeTransform {

  transform(data: Date): number {
    const hoje = new Date();
    const diferencaMilissegundos = hoje.getTime() - data.getTime();
    const diferencaDias = Math.floor(diferencaMilissegundos / (1000 * 60 * 60 * 24));
    return diferencaDias;
  }

}
