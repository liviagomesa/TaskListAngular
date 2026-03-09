export class Utils {

  static parseDateLocal(input: string): Date | null {
    if (!input) return null;
    const [ano, mes, dia] = input.split('-').map(Number);
    return new Date(ano, mes - 1, dia); // mês é 0-based
  }

  static getErrorMsg(label: string, errorKey: string, errorValue: any): string {
    /* mensagensPadrao é um objeto onde:
    → as chaves são strings
    → e o valor de cada chave é uma função que recebe o nome do campo e o valor do erro, retornando a mensagem final */
    const mensagensPadrao: Record<string, (l: string, errValue: any) => string> = {
      required: (l) => `O campo ${l} é obrigatório.`,
      requiredTrue: (l) => `Você deve marcar o campo ${l} para continuar.`,
      email: () => `Formato de e-mail inválido.`,
      minlength: (l, errValue) => `O campo ${l} deve ter no mínimo ${errValue.requiredLength} caracteres (recebido: ${errValue.actualLength}).`,
      maxlength: (l, errValue) => `O campo ${l} deve ter no máximo ${errValue.requiredLength} caracteres (recebido: ${errValue.actualLength}).`,
      pattern: (l) => `O valor informado em ${l} não está no formato esperado.`,
      tipoInvalido: (l, errValue) => `O campo ${l} espera um valor do tipo ${errValue.expected}, mas recebeu ${errValue.received}.`,
      opcaoInvalida: (l, errValue) => `O valor selecionado em ${l} não é permitido. Permitidos: ${errValue.expected.join(', ')}.`,
      opcoesInvalidas: (l, errValue) => `Alguns valores informados em ${l} não são permitidos. Permitidos: ${errValue.expected.join(', ')}.`,
      estruturaInvalida: (l, errValue) => `A estrutura do valor informado em ${l} é inválida. Propriedades necessárias: ${errValue.chavesEsperadas.join(', ')}.`,
      emailEmUso: () => `O e-mail já está cadastrado.`,
      notEqual: (l, errValue) => `O valor do campo ${l} não confere com o campo ${this.camelToText(errValue.otherField)}.`,
      mask: (_, errValue) => `Formato inválido. Formato esperado: ${errValue.requiredMask}`
    };
    if (mensagensPadrao[errorKey]) {
      return mensagensPadrao[errorKey](label, errorValue);
    }
    console.warn('Erro não mapeado:', errorKey, errorValue);
    return `Erro no campo ${label}.`;
  }

  static camelToText(value: string): string {
    if (!value) return '';
    const texto = value.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

}
