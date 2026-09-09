export interface Color {
  name: string;
  color: string;
}

export const Colors: Color[] = [
  { name: 'Red', color: '#F44336' },
  { name: 'DarkRed', color: '#C62828' },
  { name: 'VeryDarkRed', color: '#B71C1C' },
  { name: 'Blue', color: '#2196F3' },
  { name: 'DarkBlue', color: '#1976D2' },
  { name: 'VeryDarkBlue', color: '#0D47A1' },
  { name: 'Green', color: '#4CAF50' },
  { name: 'DarkGreen', color: '#388E3C' },
  { name: 'VeryDarkGreen', color: '#1B5E20' },
  { name: 'Orange', color: '#FF9800' },
  { name: 'DarkOrange', color: '#F57C00' },
  { name: 'VeryDarkOrange', color: '#E65100' },
  { name: 'Purple', color: '#9C27B0' },
  { name: 'DarkPurple', color: '#7B1FA2' },
  { name: 'VeryDarkPurple', color: '#4A148C' },
  { name: 'Yellow', color: '#FFEB3B' },
  { name: 'DarkYellow', color: '#FBC02D' },
  { name: 'VeryDarkYellow', color: '#F57F17' },
  { name: 'Cyan', color: '#00BCD4' },
  { name: 'DarkCyan', color: '#0097A7' },
  { name: 'VeryDarkCyan', color: '#006064' },
  { name: 'Magenta', color: '#E91E63' },
  { name: 'DarkMagenta', color: '#D81B60' },
  { name: 'VeryDarkMagenta', color: '#880E4F' },
  { name: 'Brown', color: '#795548' },
  { name: 'DarkBrown', color: '#5D4037' },
  { name: 'VeryDarkBrown', color: '#3E2723' },
  { name: 'Gray', color: '#9E9E9E' },
  { name: 'DarkGray', color: '#757575' },
  { name: 'VeryDarkGray', color: '#424242' },
  { name: 'Teal', color: '#00796B' },
  { name: 'DarkTeal', color: '#004D40' },
  { name: 'VeryDarkTeal', color: '#00251A' },
  { name: 'Lime', color: '#CDDC39' },
  { name: 'DarkLime', color: '#AEBF24' },
  { name: 'VeryDarkLime', color: '#827717' },
  { name: 'Indigo', color: '#3F51B5' },
  { name: 'DarkIndigo', color: '#303F9F' },
  { name: 'VeryDarkIndigo', color: '#1A237E' },
  { name: 'LightGray', color: '#d1d8e1' },
];

/**
 * Retorna a cor em hexadecimal baseada no nome passado.
 * Caso não encontre, retorna a primeira cor do array (Red) como fallback.
 */
export const getColor = (indexName: string): string => {
  const foundColor = Colors.find((c) => c.name === indexName);
  return foundColor ? foundColor.color : Colors[0].color;
};

/**
 * Dicionário tipado contendo todas as variáveis de cores globais do sistema.
 */
export const allColors: Record<string, string> = {
  'cor-base-tema': '#B08E51',
  'cor-base-tema-tranparent': '#b08f5121',
  'marrom-200': '#ffdfa4',
  'marrom-tema': '#706550',
  'marrom-dark-tema': '#33302B',
  'azul-tema': '#517BB0',
  'cinza-tema': '#48505B',
  'cinza-tema-transparent': '#48505b49',
  'cinza-claro': '#d1d8e1',
  'vermelho-salmao': '#ff3838',
  'laranja-forte': '#f64600',
  'laranja-base': '#ED9209',
  'laranja-claro': '#ff9d5b',
  'laranja-transparent': '#ED920940',
  'marrom-300': '#d3c4a6',
  transparent: '#00000000',
  blue: '#1fb6ff',
  'ghost-white': '#f9fafb',
  'white-200': '#e7e7e7',
  white: '#FFF',
  black: '#000',
  'red-800': '#9C0000',
  'red-500': '#DB0C00',
  'red-300': '#FFC9C7',
  'red-200': '#FFEAEA',
  green: '#1DDC67',
  purple: '#7e5bef',
  pink: '#ff49db',
  orange: '#ff7849',
  yellow: '#ffc82c',
  'gray-800': '#272727',
  'gray-700': '#444',
  'gray-dark': '#333',
  'gray-600': '#666',
  'gray-500': '#374151',
  'gray-400': '#8A8A8A',
  gray: '#ccc',
  silver: '#9ca3af',
  'gray-300': '#D9D9D9',
  'gray-light': '#d3dce6',
  shadow: '#00000050',
  'shadow-light': '#00000015',
  'shadow-white': '#ffffff26',
  'dark-graphite': '#2c2c2c',
  'dark-coffee': '#5c2e0f',
};