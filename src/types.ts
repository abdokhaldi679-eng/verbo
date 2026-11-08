export interface ChoiceExercise {
  type: 'choice'
  id: string
  instruction: string
  question: string
  options: string[]
  answer: string
  audio?: string
}

export interface WordBankExercise {
  type: 'wordbank'
  id: string
  instruction: string
  question: string
  answer: string[]
  distractors: string[]
}

export interface ListenExercise {
  type: 'listen'
  id: string
  instruction: string
  text: string
  options: string[]
  answer: string
}

export interface MatchExercise {
  type: 'match'
  id: string
  instruction: string
  pairs: { left: string; right: string }[]
}

export interface TypeExercise {
  type: 'type'
  id: string
  instruction: string
  question: string
  answer: string
  accepted?: string[]
}

export type Exercise =
  | ChoiceExercise
  | WordBankExercise
  | ListenExercise
  | MatchExercise
  | TypeExercise

export type ExerciseType = Exercise['type']

export interface Lesson {
  id: string
  title: string
  icon: string
  /** Locale BCP-47 utilisée par la synthèse vocale pour cette leçon. */
  lang?: string
  exercises: Exercise[]
}

export interface Unit {
  id: string
  title: string
  subtitle: string
  color: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  subtitle: string
  from: string
  to: string
  fromCode: string
  toCode: string
  units: Unit[]
}

export type SessionMode = 'lesson' | 'review'

export interface ExerciseOutcome {
  exerciseId: string
  firstTryCorrect: boolean
}

export interface CardState {
  ease: number
  interval: number
  reps: number
  lapses: number
  due: string
}

export interface SelectedToken {
  id: string
  text: string
}

export interface CompletionSummary {
  xpEarned: number
  accuracy: number
  correct: number
  total: number
  streak: number
  goalReached: boolean
}
