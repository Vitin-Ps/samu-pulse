import dayjs from 'dayjs';

export const gerarUUID = () => {
  // Gera uma string com 16 bytes aleatórios
  let d = new Date().getTime();
  const d2 = (performance && performance.now && performance.now() * 1000) || 0;
  d += d2; // Adiciona mais aleatoriedade

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const removerAcentuacoes = (texto: string): string => {
  const mapaAcentos: Record<string, string> = {
    á: 'a',
    é: 'e',
    í: 'i',
    ó: 'o',
    ú: 'u',
    ã: 'a',
    õ: 'o',
    â: 'a',
    ê: 'e',
    î: 'i',
    ô: 'o',
    û: 'u',
    à: 'a',
    è: 'e',
    ì: 'i',
    ò: 'o',
    ù: 'u',
    ä: 'a',
    ë: 'e',
    ï: 'i',
    ö: 'o',
    ü: 'u',
  };

  return texto
    .replace(
      /[áéíóúãõâêîôûàèìòùäëïöü]/g,
      (letra: string) => mapaAcentos[letra] || letra,
    )
    .replace(/[^\w\s]/gi, '')
    .toLowerCase();
};

export const isNumeric = (valor: string): boolean => {
  return /^[0-9]+$/.test(valor);
};

export const extrairLetras = (valor: string) => {
  return valor.replace(/[^a-zA-Z]/g, '');
};

export const extrairNumeros = (valor: string) => {
  return valor.replace(/\D/g, '');
};

export const extrairNumerosMoeda = (valor: string) => {
  return valor.replace(',', '.').replace(/[^0-9.]/g, '');
};

export const formatarCPF = (valor: string) => {
  // Remove tudo que não é número
  valor = extrairNumeros(valor);

  if (valor.length > 11) {
    valor = valor.slice(0, 11);
  }

  if (valor.length > 9) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  } else if (valor.length > 6) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else if (valor.length > 3) {
    valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }

  return valor;
};

export const formatarNumero = (valor: string) => {
  valor = extrairNumeros(valor);

  if (valor.length > 11) {
    valor = valor.slice(0, 11);
  }

  if (valor.length > 7) {
    valor = valor.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
  } else if (valor.length > 2) {
    valor = valor.replace(/(\d{2})(\d{1,5})/, '($1) $2');
  }

  return valor;
};

export const formatarCEP = (valor: string) => {
  valor = extrairNumeros(valor);

  if (valor.length > 8) {
    valor = valor.slice(0, 8);
  }

  if (valor.length > 5) {
    valor = valor.replace(/(\d{5})(\d{1,3})/, '$1-$2');
  }

  return valor;
};

export const validarCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  cpf = extrairNumeros(cpf);

  // Verifica o comprimento
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Calcula o primeiro dígito verificador
  let soma = 0;
  let peso = 10;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * peso--;
  }
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;

  // Verifica o primeiro dígito verificador
  if (parseInt(cpf[9]) !== digito1) return false;

  // Calcula o segundo dígito verificador
  soma = 0;
  peso = 11;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * peso--;
  }
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;

  // Verifica o segundo dígito verificador
  return parseInt(cpf[10]) === digito2;
};

export const consultarCep = async (cep: string) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) throw new Error('CEP não encontrado');
    const dados = await response.json();
    if (dados.erro) return null;
    return dados;
  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    return null;
  }
};

export function converterMoedaReal(
  number: number | undefined,
  mostrarCentavos: boolean = true,
): string | undefined {
  if (number)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: mostrarCentavos ? 2 : 0,
    }).format(number);
  else return undefined;
}

export const formatDateOfPattern = (
  date: Date | string | undefined,
  pattern: string,
): string => {
  if (!date) return '-';
  return dayjs(date).format(pattern);
};

export const replaceSpaceWithCharacter = (text: string, character: string) => {
  return text.replace(/ /g, character);
};

export const truncateFileName = (name: string, maxLength: number = 50): string => {
  if (name.length <= maxLength) return name;
  const lastDotIndex = name.lastIndexOf('.');
  const ext = lastDotIndex > 0 ? name.substring(lastDotIndex) : '';
  const nameWithoutExt = lastDotIndex > 0 ? name.substring(0, lastDotIndex) : name;
  const maxNameLength = maxLength - 3 - ext.length;
  const truncatedName =
    nameWithoutExt.length > maxNameLength
      ? nameWithoutExt.substring(0, maxNameLength)
      : nameWithoutExt;
  return truncatedName + '...' + ext;
};

export const getUrlCarregarImg = (): string => {
  return `${import.meta.env.VITE_API}/api/arquivos/`;
};
