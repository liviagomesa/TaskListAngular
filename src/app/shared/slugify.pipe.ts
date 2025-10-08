import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slugify'
})
export class SlugifyPipe implements PipeTransform {

  transform(value: string): string {
    return value
      .normalize('NFD')               // separa os acentos
      .replace(/[\u0300-\u036f]/g, '') // remove os acentos
      .replace(/\s+/g, '-')           // substitui espaços por hífen
      .toLowerCase();
  }

}
