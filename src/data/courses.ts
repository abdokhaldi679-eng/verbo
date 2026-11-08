import type { Course } from '../types'
import { course as englishCourse } from './course'
import { generateCourse } from './generateCourse'
import { isLanguageCode } from './languages'

export const DEFAULT_NATIVE = 'fr'
export const DEFAULT_TARGET = 'en'

const generatedCache = new Map<string, Course>()

/**
 * Retourne le cours correspondant à la paire de langues.
 * La paire français → anglais utilise le parcours complet historique ;
 * toutes les autres paires utilisent le module de découverte A1 généré.
 */
export function getCourseForPair(nativeCode: string, targetCode: string): Course {
  const native = isLanguageCode(nativeCode) ? nativeCode : DEFAULT_NATIVE
  const target = isLanguageCode(targetCode) ? targetCode : DEFAULT_TARGET

  if (native === target) {
    return getCourseForPair(DEFAULT_NATIVE, DEFAULT_TARGET)
  }

  if (native === 'fr' && target === 'en') {
    return englishCourse
  }

  const key = `${native}-${target}`
  const cached = generatedCache.get(key)
  if (cached) return cached

  const generated = generateCourse(native, target)
  generatedCache.set(key, generated)
  return generated
}
