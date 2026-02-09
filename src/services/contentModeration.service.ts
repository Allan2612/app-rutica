/**
 * Servicio de moderación de contenido
 * Filtra palabras inapropiadas, ofensivas o contenido no deseado
 */

// Lista de palabras inapropiadas en español (censuradas parcialmente para el código)
const INAPPROPRIATE_WORDS: string[] = [
  // Insultos comunes
  'idiota',
  'estupido',
  'estúpido',
  'imbecil',
  'imbécil',
  'tonto',
  'pendejo',
  'pendeja',
  'cabron',
  'cabrón',
  'cabrona',
  'maldito',
  'maldita',
  'bastardo',
  'bastarda',
  'inutil',
  'inútil',
  'tarado',
  'tarada',
  'retrasado',
  'retrasada',

  // Groserías fuertes
  'puta',
  'puto',
  'putada',
  'putas',
  'putos',
  'hijueputa',
  'jueputa',
  'hp',
  'hdp',
  'malparido',
  'malparida',
  'gonorrea',
  'mierda',
  'mierdas',
  'cagar',
  'cagada',
  'cagado',
  'culo',
  'culero',
  'culera',
  'verga',
  'vergas',
  'picha',
  'pinga',
  'carajo',
  'coño',
  'joder',
  'jodido',
  'jodida',
  'chingar',
  'chingada',
  'chingado',
  'mamada',
  'mamar',
  'cojones',
  'cojon',
  'huevon',
  'huevón',
  'huevona',
  'güevon',
  'weon',
  'weona',
  'ctm',
  'csm',
  'ptm',
  'wtf',

  // Discriminación y odio
  'negro de mierda',
  'india',
  'indio de mierda',
  'marica',
  'maricon',
  'maricón',
  'maricona',
  'joto',
  'jota',
  'trolo',
  'puto gay',
  'tortillera',
  'lesbiana de mierda',
  'gordo asqueroso',
  'gorda asquerosa',
  'zorra',
  'zorras',
  'perra',
  'perras',
  'ramera',
  'prostituta',
  'golfa',

  // Amenazas
  'te voy a matar',
  'te mato',
  'voy a matarte',
  'muérete',
  'muerete',
  'ojalá te mueras',
  'ojala te mueras',
  'te deseo la muerte',
  'muerte',

  // Variaciones con números y símbolos (leet speak)
  'put4',
  'put0',
  'm1erda',
  'c4bron',
  'p3ndejo',
  'id10ta',
  'estup1do',

  // Regionalismos ofensivos (Costa Rica, México, Argentina, etc.)
  'mae hijueputa',
  'playo',
  'playa',
  'carepicha',
  'picha',
  'pichas',
  'pelotudo',
  'pelotuda',
  'boludo',
  'boluda',
  'forro',
  'forra',
  'gil',
  'garca',
  'choto',
  'conchudo',
  'conchuda',
  'concha',
  'la concha',
  'pinche',
  'naco',
  'naca',
  'mamón',
  'mamon',
  'mamona',
  'culiao',
  'culiado',
  'aweonao',
  'conchetumare',
  'wea',
  'weá',
];

// Patrones regex para detectar variaciones
const INAPPROPRIATE_PATTERNS: RegExp[] = [
  /p+u+t+[a4@o0]+s?/gi,
  /m+[i1]+e+r+d+[a4@]+s?/gi,
  /h+[i1]+j+u+e+p+u+t+[a4@]+/gi,
  /c+[a4@]+b+r+[o0]+n+e?s?/gi,
  /p+e+n+d+e+j+[o0@a4]+s?/gi,
  /[i1]+d+[i1]+[o0]+t+[a4@]+s?/gi,
  /[i1]+m+b+[e3]+c+[i1]+l+e?s?/gi,
  /m+[a4@]+r+[i1]+c+[o0@a4]+n?e?s?/gi,
  /v+e+r+g+[a4@]+s?/gi,
  /c+[o0]+ñ+[o0]+s?/gi,
  /g+[o0]+n+[o0]+r+r+e+[a4@]+/gi,
  /m+[a4@]+l+p+[a4@]+r+[i1]+d+[o0@a4]+/gi,
];

// Frases inapropiadas completas
const INAPPROPRIATE_PHRASES: string[] = [
  'eres un asco',
  'que asco',
  'da asco',
  'me das asco',
  'son unos ladrones',
  'me robaron',
  'estafadores',
  'son estafadores',
  'los odio',
  'te odio',
  'ojala se mueran',
  'deberian cerrar',
  'que se vayan',
  'lugar de mierda',
  'servicio de mierda',
  'comida de mierda',
];

export interface ContentModerationResult {
  isClean: boolean;
  flaggedWords: string[];
  message: string;
}

/**
 * Normaliza el texto para comparación
 * - Convierte a minúsculas
 * - Remueve acentos
 * - Remueve caracteres especiales repetidos
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s]/g, ' ') // Reemplazar caracteres especiales
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim();
}

/**
 * Verifica si el texto contiene palabras inapropiadas
 */
function checkInappropriateWords(text: string, normalizedText: string): string[] {
  const flagged: string[] = [];

  for (const word of INAPPROPRIATE_WORDS) {
    const normalizedWord = normalizeText(word);
    // Buscar como palabra completa o parte de palabra
    const regex = new RegExp(`\\b${normalizedWord}\\b|${normalizedWord}`, 'gi');
    if (regex.test(normalizedText)) {
      flagged.push(word);
    }
  }

  return flagged;
}

/**
 * Verifica patrones de evasión (leet speak, caracteres especiales)
 */
function checkPatterns(text: string): string[] {
  const flagged: string[] = [];

  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(text)) {
      const match = text.match(pattern);
      if (match) {
        flagged.push(match[0]);
      }
    }
  }

  return flagged;
}

/**
 * Verifica frases inapropiadas completas
 */
function checkInappropriatePhrases(normalizedText: string): string[] {
  const flagged: string[] = [];

  for (const phrase of INAPPROPRIATE_PHRASES) {
    const normalizedPhrase = normalizeText(phrase);
    if (normalizedText.includes(normalizedPhrase)) {
      flagged.push(phrase);
    }
  }

  return flagged;
}

/**
 * Modera el contenido de un texto
 * @param text - El texto a moderar
 * @returns Resultado de la moderación con indicador de limpieza y palabras flaggeadas
 */
export function moderateContent(text: string): ContentModerationResult {
  if (!text || text.trim().length === 0) {
    return {
      isClean: true,
      flaggedWords: [],
      message: '',
    };
  }

  const normalizedText = normalizeText(text);

  // Recolectar todas las palabras/frases flaggeadas
  const flaggedWords = new Set<string>();

  // Verificar palabras inapropiadas
  checkInappropriateWords(text, normalizedText).forEach((w) => flaggedWords.add(w));

  // Verificar patrones
  checkPatterns(text).forEach((w) => flaggedWords.add(w));

  // Verificar frases
  checkInappropriatePhrases(normalizedText).forEach((w) => flaggedWords.add(w));

  const flaggedArray = Array.from(flaggedWords);
  const isClean = flaggedArray.length === 0;

  return {
    isClean,
    flaggedWords: flaggedArray,
    message: isClean
      ? ''
      : 'Tu reseña contiene palabras o frases inapropiadas. Por favor, modifica el contenido para que sea respetuoso.',
  };
}

/**
 * Valida el contenido de una reseña (rating + comentario)
 * @throws Error si el contenido no es apropiado
 */
export function validateReviewContent(comment: string): void {
  const result = moderateContent(comment);

  if (!result.isClean) {
    throw new Error(result.message);
  }
}
