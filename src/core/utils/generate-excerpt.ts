export function generateExcerpt(content: string, maxLength: number = 150): string {
  // Remove HTML tags se houver
  const plainText = content.replace(/<[^>]*>/g, '')
  
  // Remove quebras de linha e espaços extras
  const cleanText = plainText.replace(/\s+/g, ' ').trim()
  
  // Se o texto for menor que o limite, retorna o texto completo
  if (cleanText.length <= maxLength) {
    return cleanText
  }
  
  // Encontra o último espaço antes do limite para não cortar palavras
  const truncated = cleanText.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  // Se não encontrar espaço, corta no limite exato
  const finalText = lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) : truncated
  
  return finalText + '...'
}
