import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCase'
})
export class CamelCasePipe implements PipeTransform {

  transform(texto: string): string {
    if (!texto) return '';

    // remove acentos
    let semAcentos = texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // divide em palavras (qualquer espaço)
    const partes = semAcentos
      .trim()
      .toLowerCase()
      .split(/\s+/);

    // monta camelCase
    return partes
      .map((parte, i) =>
        i === 0
          ? parte
          : parte.charAt(0).toUpperCase() + parte.slice(1)
      )
      .join('');
  }

}
