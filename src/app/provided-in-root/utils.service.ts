import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public parseDateLocal(input: string): Date | null {
    if (!input) return null;
    const [ano, mes, dia] = input.split('-').map(Number);
    return new Date(ano, mes - 1, dia); // mês é 0-based
  }
}
