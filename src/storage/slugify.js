const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e',
  ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

export function slugify(input) {
  return String(input)
    .toLowerCase()
    .split('')
    .map((char) => {
      if (TRANSLIT[char] !== undefined) return TRANSLIT[char];
      if (/[a-z0-9_-]/.test(char)) return char;
      return '-';
    })
    .join('')
    .replace(/-+/g, '-') 
    .replace(/^-|-$/g, ''); 
}