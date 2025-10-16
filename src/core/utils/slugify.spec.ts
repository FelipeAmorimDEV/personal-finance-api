import { describe, it, expect } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it('should convert text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should remove accents and special characters', () => {
    expect(slugify('Ação')).toBe('acao')
    expect(slugify('Correção')).toBe('correcao')
    expect(slugify('Configuração')).toBe('configuracao')
    expect(slugify('Educação')).toBe('educacao')
  })

  it('should handle ç and Ç characters', () => {
    expect(slugify('Açúcar')).toBe('acucar')
    expect(slugify('Ção')).toBe('cao')
    expect(slugify('Ação e Reação')).toBe('acao-e-reacao')
  })

  it('should handle multiple accents', () => {
    expect(slugify('Café')).toBe('cafe')
    expect(slugify('Ação')).toBe('acao')
    expect(slugify('Correção')).toBe('correcao')
    expect(slugify('Educação')).toBe('educacao')
    expect(slugify('Configuração')).toBe('configuracao')
  })

  it('should handle complex text with multiple words', () => {
    expect(slugify('Como Configurar a Aplicação')).toBe('como-configurar-a-aplicacao')
    expect(slugify('Guia de Configuração Avançada')).toBe('guia-de-configuracao-avancada')
    expect(slugify('Tutorial de Programação em JavaScript')).toBe('tutorial-de-programacao-em-javascript')
  })

  it('should handle special characters and symbols', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
    expect(slugify('Test@#$%^&*()')).toBe('test')
    expect(slugify('Multiple   Spaces')).toBe('multiple-spaces')
  })

  it('should handle edge cases', () => {
    expect(slugify('')).toBe('')
    expect(slugify('   ')).toBe('')
    expect(slugify('---')).toBe('')
    expect(slugify('---test---')).toBe('test')
  })

  it('should handle mixed case and special characters', () => {
    expect(slugify('AÇÃO')).toBe('acao')
    expect(slugify('Ação & Reação')).toBe('acao-reacao')
    expect(slugify('Configuração_Avançada')).toBe('configuracao-avancada')
  })

  it('should handle numbers and letters', () => {
    expect(slugify('Post 123')).toBe('post-123')
    expect(slugify('Tutorial 2024')).toBe('tutorial-2024')
    expect(slugify('API v2.0')).toBe('api-v2-0')
  })
})
