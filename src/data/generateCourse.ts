import type { Course, Exercise, Lesson, Unit } from '../types'
import { INSTRUCTIONS } from './instructions'
import { getLanguage, type Language } from './languages'
import { getPhrase, PHRASES, type Phrase, type PhraseId } from './phrasebook'

interface LessonGroup {
  title: string
  icon: string
  phrases: PhraseId[]
}

const LESSON_GROUPS: LessonGroup[] = [
  {
    title: 'Saluer',
    icon: '👋',
    phrases: ['hello', 'good_evening', 'goodbye', 'good_night'],
  },
  {
    title: 'Être poli',
    icon: '🙏',
    phrases: ['thank_you', 'please', 'yes', 'no'],
  },
  {
    title: 'Faire connaissance',
    icon: '🤝',
    phrases: ['how_are_you', 'im_fine', 'my_name_is', 'nice_to_meet_you'],
  },
  {
    title: 'Se débrouiller',
    icon: '🧭',
    phrases: ['excuse_me', 'i_dont_understand', 'do_you_speak_english', 'see_you_soon'],
  },
  {
    title: 'En voyage',
    icon: '🧳',
    phrases: ['where_is_bathroom', 'how_much', 'water', 'help'],
  },
]

function text(phrase: Phrase, language: Language): string {
  return phrase.translations[language.code]
}

function optionsFor(answer: string, pool: string[], seed: number): string[] {
  const distractors: string[] = []
  for (const candidate of pool) {
    if (candidate !== answer && !distractors.includes(candidate)) {
      distractors.push(candidate)
    }
    if (distractors.length === 3) break
  }

  const options = [answer, ...distractors]
  const shift = seed % options.length
  return [...options.slice(shift), ...options.slice(0, shift)]
}

function nextId(courseId: string, lessonIndex: number, exercises: Exercise[]): string {
  return `${courseId}-l${lessonIndex + 1}e${exercises.length + 1}`
}

function wordBankTokens(phrases: Phrase[], target: Language): string[] {
  const tokens = phrases.flatMap((phrase) => text(phrase, target).split(/\s+/))
  return Array.from(new Set(tokens))
}

function buildLesson(
  courseId: string,
  lessonIndex: number,
  group: LessonGroup,
  native: Language,
  target: Language,
  allTargetTokens: string[],
): Lesson {
  const phrases = group.phrases.map(getPhrase)
  const nativeTexts = phrases.map((phrase) => text(phrase, native))
  const targetTexts = phrases.map((phrase) => text(phrase, target))
  const exercises: Exercise[] = []

  // 1. Une question de compréhension pour chaque phrase.
  phrases.forEach((phrase, index) => {
    exercises.push({
      type: 'choice',
      id: nextId(courseId, lessonIndex, exercises),
      instruction: INSTRUCTIONS[native.code].choice,
      question: text(phrase, native),
      options: optionsFor(text(phrase, target), targetTexts, index + lessonIndex),
      answer: text(phrase, target),
    })
  })

  // 2. Deux exercices d'écoute.
  for (const index of [1, 3]) {
    const phrase = phrases[index]
    exercises.push({
      type: 'listen',
      id: nextId(courseId, lessonIndex, exercises),
      instruction: INSTRUCTIONS[native.code].listen,
      text: text(phrase, target),
      options: optionsFor(text(phrase, native), nativeTexts, index + lessonIndex),
      answer: text(phrase, native),
    })
  }

  // 3. Une association des quatre paires.
  exercises.push({
    type: 'match',
    id: nextId(courseId, lessonIndex, exercises),
    instruction: INSTRUCTIONS[native.code].match,
    pairs: phrases.map((phrase) => ({
      left: text(phrase, native),
      right: text(phrase, target),
    })),
  })

  // 4. Un exercice de production, adapté à l'écriture de la langue cible.
  const wordBankPhrase = target.noWordSpaces
    ? undefined
    : phrases.find((phrase) => text(phrase, target).split(/\s+/).length >= 3)

  if (wordBankPhrase) {
    const answer = text(wordBankPhrase, target).split(/\s+/)
    const distractors = allTargetTokens
      .filter((token) => !answer.includes(token))
      .slice(0, 4)

    exercises.push({
      type: 'wordbank',
      id: nextId(courseId, lessonIndex, exercises),
      instruction: INSTRUCTIONS[native.code].wordbank,
      question: text(wordBankPhrase, native),
      answer,
      distractors,
    })
  } else if (target.latinScript) {
    const typePhrase =
      phrases.find(
        (phrase) =>
          !text(phrase, target).includes('…') && text(phrase, target).trim().length >= 3,
      ) ?? phrases[0]

    exercises.push({
      type: 'type',
      id: nextId(courseId, lessonIndex, exercises),
      instruction: INSTRUCTIONS[native.code].type,
      question: text(typePhrase, native),
      answer: text(typePhrase, target),
      accepted: [],
    })
  } else {
    const phrase = phrases[0]
    exercises.push({
      type: 'choice',
      id: nextId(courseId, lessonIndex, exercises),
      instruction: INSTRUCTIONS[native.code].choice,
      question: text(phrase, target),
      options: optionsFor(text(phrase, native), nativeTexts, lessonIndex),
      answer: text(phrase, native),
    })
  }

  return {
    id: `${courseId}-l${lessonIndex + 1}`,
    title: group.title,
    icon: group.icon,
    lang: target.tts,
    exercises,
  }
}

export function generateCourse(nativeCode: string, targetCode: string): Course {
  const native = getLanguage(nativeCode)
  const target = getLanguage(targetCode)
  if (native.code === target.code) {
    throw new Error('La langue maternelle et la langue apprise doivent être différentes.')
  }

  const courseId = `${native.code}-${target.code}-a1`
  const unit: Unit = {
    id: `${courseId}-u1`,
    title: 'Premiers contacts',
    subtitle: '20 phrases essentielles pour voyager',
    color: '#4f46e5',
    lessons: LESSON_GROUPS.map((group, index) =>
      buildLesson(courseId, index, group, native, target, wordBankTokens(PHRASES, target)),
    ),
  }

  return {
    id: courseId,
    title: `${target.name} — Découverte`,
    subtitle: `Pour ${native.name} · A1`,
    from: native.name,
    to: target.name,
    fromCode: native.code,
    toCode: target.code,
    units: [unit],
  }
}
