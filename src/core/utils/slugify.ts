export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Remove acentos e caracteres especiais
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Substitui ç por c
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c')
    // Remove caracteres que não são letras, números, espaços, hífens ou pontos
    .replace(/[^\w\s.-]/g, '')
    // Substitui pontos por hífens
    .replace(/\./g, '-')
    // Substitui espaços e underscores por hífens
    .replace(/[\s_-]+/g, '-')
    // Remove hífens do início e fim
    .replace(/^-+|-+$/g, '')
}

