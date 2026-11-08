import type { Exercise } from '../types'

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    // Retire les accents latins sans supprimer les lettres cyrilliques,
    // arabes, grecques, indiennes ou les idéogrammes.
    .replace(/\p{M}/gu, '')
    .normalize('NFC')
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}'\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isTypedAnswerCorrect(value: string, exercise: Exercise): boolean {
  if (exercise.type !== 'type') return false
  const accepted = [exercise.answer, ...(exercise.accepted ?? [])]
  return accepted.some((answer) => normalize(answer) === normalize(value))
}

export function answerText(exercise: Exercise): string {
  switch (exercise.type) {
    case 'choice':
    case 'listen':
      return exercise.answer
    case 'type':
      return exercise.answer
    case 'wordbank':
      return exercise.answer.join(' ')
    case 'match':
      return exercise.pairs.map((pair) => `${pair.left} = ${pair.right}`).join(' · ')
  }
}
