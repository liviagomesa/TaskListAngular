export class Utils {

  static parseDateLocal(input: string): Date | null {
    if (!input) return null;
    const [ano, mes, dia] = input.split('-').map(Number);
    return new Date(ano, mes - 1, dia); // mês é 0-based
  }

}
