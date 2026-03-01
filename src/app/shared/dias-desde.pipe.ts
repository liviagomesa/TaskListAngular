import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diasDesde'
})
export class DiasDesdePipe implements PipeTransform {

  transform(data: string | Date | null | undefined): number | null {

    if (!data) return null;

    const dateObj = typeof data === 'string'
      ? new Date(data)
      : data;

    if (isNaN(dateObj.getTime())) return null;

    const hoje = new Date();

    const diffMs = hoje.getTime() - dateObj.getTime();

    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

}
