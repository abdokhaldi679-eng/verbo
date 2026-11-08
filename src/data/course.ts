import type {
  ChoiceExercise,
  Course,
  ListenExercise,
  MatchExercise,
  TypeExercise,
  WordBankExercise,
} from '../types'

const choice = (
  id: string,
  question: string,
  options: string[],
  answer: string,
  audio?: string,
): ChoiceExercise => ({
  type: 'choice',
  id,
  instruction: 'Choisis la bonne réponse',
  question,
  options,
  answer,
  audio,
})

const wordbank = (
  id: string,
  question: string,
  answer: string,
  distractors: string,
): WordBankExercise => ({
  type: 'wordbank',
  id,
  instruction: 'Traduis cette phrase',
  question,
  answer: answer.split(' '),
  distractors: distractors.split(' '),
})

const listen = (
  id: string,
  text: string,
  options: string[],
  answer: string,
): ListenExercise => ({
  type: 'listen',
  id,
  instruction: 'Écoute et choisis la bonne traduction',
  text,
  options,
  answer,
})

const match = (id: string, pairs: string[][]): MatchExercise => ({
  type: 'match',
  id,
  instruction: 'Associe les paires',
  pairs: pairs.map(([left, right]) => ({ left, right })),
})

const type = (
  id: string,
  question: string,
  answer: string,
  accepted?: string[],
): TypeExercise => ({
  type: 'type',
  id,
  instruction: 'Écris en anglais',
  question,
  answer,
  accepted,
})

export const course: Course = {
  id: 'fr-en-a1',
  title: 'Anglais',
  subtitle: 'Les bases pour voyager et discuter',
  from: 'Français',
  to: 'Anglais',
  fromCode: 'fr',
  toCode: 'en',
  units: [
    {
      id: 'u1',
      title: 'Premiers mots',
      subtitle: 'Salutations et présentations',
      color: '#4f46e5',
      lessons: [
        {
          id: 'u1l1',
          title: 'Bonjour !',
          icon: '👋',
          exercises: [
            choice('u1l1e1', 'Que signifie « hello » ?', ['Bonjour', 'Au revoir', 'Merci', 'Pardon'], 'Bonjour'),
            choice('u1l1e2', 'Comment dit-on « au revoir » ?', ['Goodbye', 'Hello', 'Please', 'Sorry'], 'Goodbye'),
            listen('u1l1e3', 'Good morning', ['Bonjour (le matin)', 'Bonsoir', 'Bonne nuit', 'Au revoir'], 'Bonjour (le matin)'),
            match('u1l1e4', [
              ['hello', 'bonjour'],
              ['goodbye', 'au revoir'],
              ['please', "s'il te plaît"],
              ['thank you', 'merci'],
            ]),
            wordbank('u1l1e5', 'Merci beaucoup.', 'Thank you very much', 'please good bye'),
            type('u1l1e6', 'Bonsoir.', 'good evening'),
            choice('u1l1e7', "Quelle est la traduction de « s'il te plaît » ?", ['Please', 'Thanks', 'Hello', 'Sorry'], 'Please'),
            wordbank('u1l1e8', 'Bonjour, comment vas-tu ?', 'Hello how are you', 'is they good'),
          ],
        },
        {
          id: 'u1l2',
          title: 'Se présenter',
          icon: '🙋',
          exercises: [
            choice('u1l2e1', '« My name is... » signifie...', ["Je m'appelle...", "J'habite...", 'Je suis...', "J'aime..."], "Je m'appelle..."),
            wordbank('u1l2e2', "Je m'appelle Marie.", 'My name is Marie', 'am your I'),
            type('u1l2e3', 'Je suis étudiant.', 'I am a student', ["I'm a student"]),
            listen('u1l2e4', 'Nice to meet you', ['Enchanté(e)', 'À bientôt', 'Comment vas-tu ?', 'Bonne chance'], 'Enchanté(e)'),
            choice('u1l2e5', 'Comment dit-on « Comment vas-tu ? » ?', ['How are you?', 'What is your name?', 'Where are you from?', 'How old are you?'], 'How are you?'),
            match('u1l2e6', [
              ['I', 'je'],
              ['you', 'tu'],
              ['name', 'nom'],
              ['student', 'étudiant'],
            ]),
            wordbank('u1l2e7', "Je m'appelle Paul et je suis français.", 'My name is Paul and I am French', 'your is English'),
            choice('u1l2e8', '« I am from France. » signifie...', ['Je viens de France', "J'habite en France", 'Je vais en France', 'Je suis en France'], 'Je viens de France'),
          ],
        },
        {
          id: 'u1l3',
          title: 'Les politesses',
          icon: '🙏',
          exercises: [
            choice('u1l3e1', 'Comment dit-on « excusez-moi » ?', ['Excuse me', 'Sorry', 'Please', 'Thank you'], 'Excuse me'),
            choice('u1l3e2', 'Que signifie « sorry » ?', ['Désolé(e)', 'Pardon', 'Merci', 'Oui'], 'Désolé(e)'),
            wordbank('u1l3e3', 'Oui, merci beaucoup.', 'Yes thank you very much', 'no please sorry'),
            type('u1l3e4', 'Non.', 'no'),
            match('u1l3e5', [
              ['yes', 'oui'],
              ['no', 'non'],
              ['sorry', 'désolé'],
              ['excuse me', 'excusez-moi'],
            ]),
            listen('u1l3e6', 'Thank you very much', ['Merci beaucoup', "S'il vous plaît", 'De rien', 'Excusez-moi'], 'Merci beaucoup'),
            choice('u1l3e7', "« You're welcome » se traduit par...", ['De rien', 'Bienvenue', 'Merci', "S'il vous plaît"], 'De rien'),
            wordbank('u1l3e8', 'Excusez-moi, je suis désolé.', 'Excuse me I am sorry', 'my you are'),
          ],
        },
        {
          id: 'u1l4',
          title: 'Révision',
          icon: '🔁',
          exercises: [
            choice('u1l4e1', 'Que signifie « goodbye » ?', ['Au revoir', 'Bonjour', 'Merci', 'Pardon'], 'Au revoir'),
            wordbank('u1l4e2', "Je m'appelle Léa.", 'My name is Léa', 'am your I'),
            listen('u1l4e3', 'How are you?', ['Comment vas-tu ?', "Comment t'appelles-tu ?", "D'où viens-tu ?", 'Quel âge as-tu ?'], 'Comment vas-tu ?'),
            match('u1l4e4', [
              ['please', "s'il te plaît"],
              ['sorry', 'désolé'],
              ['yes', 'oui'],
              ['thank you', 'merci'],
            ]),
            type('u1l4e5', 'Merci.', 'thank you', ['thanks']),
            choice('u1l4e6', '« Nice to meet you » signifie...', ['Enchanté(e)', 'À bientôt', 'De rien', 'Bonne nuit'], 'Enchanté(e)'),
            wordbank('u1l4e7', 'Non, merci.', 'No thank you', 'yes please sorry'),
            choice('u1l4e8', 'Comment dit-on « bonjour » ?', ['Hello', 'Goodbye', 'Sorry', 'Please'], 'Hello'),
          ],
        },
      ],
    },
    {
      id: 'u2',
      title: 'Au quotidien',
      subtitle: 'Manger, commander, compter',
      color: '#0891b2',
      lessons: [
        {
          id: 'u2l1',
          title: 'Manger et boire',
          icon: '🍎',
          exercises: [
            choice('u2l1e1', 'Que signifie « apple » ?', ['Une pomme', 'Une orange', 'Du pain', "De l'eau"], 'Une pomme'),
            choice('u2l1e2', 'Comment dit-on « eau » ?', ['Water', 'Milk', 'Bread', 'Coffee'], 'Water'),
            match('u2l1e3', [
              ['bread', 'pain'],
              ['water', 'eau'],
              ['coffee', 'café'],
              ['milk', 'lait'],
            ]),
            wordbank('u2l1e4', "Je voudrais de l'eau, s'il vous plaît.", 'I would like water please', 'want the bread'),
            listen('u2l1e5', 'I drink coffee', ['Je bois du café', 'Je mange du pain', 'Je veux du lait', "J'aime l'eau"], 'Je bois du café'),
            type('u2l1e6', 'Je mange une pomme.', 'I eat an apple', ['I am eating an apple']),
            choice('u2l1e7', '« hungry » signifie...', ['Qui a faim', 'Qui a soif', 'Fatigué', 'Content'], 'Qui a faim'),
            wordbank('u2l1e8', 'Elle boit du lait.', 'She drinks milk', 'drink he water'),
          ],
        },
        {
          id: 'u2l2',
          title: 'Au café',
          icon: '☕',
          exercises: [
            choice('u2l2e1', "Comment dit-on « l'addition » ?", ['The bill', 'The menu', 'The tip', 'The table'], 'The bill'),
            wordbank('u2l2e2', "Un café, s'il vous plaît.", 'A coffee please', 'the tea thanks'),
            listen('u2l2e3', 'How much is it?', ['Combien ça coûte ?', 'Où est le café ?', "Qu'est-ce que c'est ?", 'Vous voulez quoi ?'], 'Combien ça coûte ?'),
            type('u2l2e4', 'Je voudrais un thé.', 'I would like a tea', ["I'd like a tea"]),
            choice('u2l2e5', '« menu » signifie...', ['Le menu', "L'addition", 'Le serveur', 'La table'], 'Le menu'),
            match('u2l2e6', [
              ['waiter', 'serveur'],
              ['table', 'table'],
              ['bill', 'addition'],
              ['tea', 'thé'],
            ]),
            wordbank('u2l2e7', "L'addition, s'il vous plaît.", 'The bill please', 'menu thank you'),
            choice('u2l2e8', '« Enjoy your meal! » se dit...', ['Bon appétit !', 'Bonne nuit !', 'À bientôt !', 'Bienvenue !'], 'Bon appétit !'),
          ],
        },
        {
          id: 'u2l3',
          title: 'Les nombres',
          icon: '🔢',
          exercises: [
            choice('u2l3e1', 'Que signifie « seven » ?', ['Sept', 'Six', 'Huit', 'Neuf'], 'Sept'),
            match('u2l3e2', [
              ['one', 'un'],
              ['three', 'trois'],
              ['five', 'cinq'],
              ['ten', 'dix'],
            ]),
            type('u2l3e3', 'Quatre.', 'four'),
            listen('u2l3e4', 'eight', ['Huit', 'Six', 'Neuf', 'Deux'], 'Huit'),
            choice('u2l3e5', '« twelve » correspond à...', ['Douze', 'Deux', 'Dix', 'Vingt'], 'Douze'),
            wordbank('u2l3e6', "J'ai deux chats.", 'I have two cats', 'has cat three'),
            choice('u2l3e7', 'Quel nombre vient après « nine » ?', ['Ten', 'Eight', 'Seven', 'Twelve'], 'Ten'),
            wordbank('u2l3e8', 'Il y a cinq pommes.', 'There are five apples', 'is four apple'),
          ],
        },
        {
          id: 'u2l4',
          title: 'Révision',
          icon: '🔁',
          exercises: [
            choice('u2l4e1', 'Que signifie « bread » ?', ['Du pain', "De l'eau", 'Du lait', 'Du café'], 'Du pain'),
            wordbank('u2l4e2', 'Je bois du café le matin.', 'I drink coffee in the morning', 'tea the evening'),
            listen('u2l4e3', 'The bill, please', ["L'addition, s'il vous plaît", "Un café, s'il vous plaît", "Le menu, s'il vous plaît", "L'eau, s'il vous plaît"], "L'addition, s'il vous plaît"),
            match('u2l4e4', [
              ['one', 'un'],
              ['four', 'quatre'],
              ['seven', 'sept'],
              ['ten', 'dix'],
            ]),
            type('u2l4e5', 'Trois.', 'three'),
            choice('u2l4e6', 'Comment dit-on « serveur » ?', ['Waiter', 'Table', 'Bill', 'Menu'], 'Waiter'),
            wordbank('u2l4e7', "Deux cafés, s'il vous plaît.", 'Two coffees please', 'tea the thanks'),
            choice('u2l4e8', '« How much is it? » signifie...', ['Combien ça coûte ?', 'Où est-ce ?', "Qu'est-ce que c'est ?", 'Comment vas-tu ?'], 'Combien ça coûte ?'),
          ],
        },
      ],
    },
    {
      id: 'u3',
      title: 'En ville',
      subtitle: 'Se repérer, voyager, acheter',
      color: '#ea580c',
      lessons: [
        {
          id: 'u3l1',
          title: 'Où est... ?',
          icon: '📍',
          exercises: [
            choice('u3l1e1', 'Comment dit-on « Où est la gare ? » ?', ['Where is the station?', 'Where is the hotel?', 'What is the station?', 'Who is at the station?'], 'Where is the station?'),
            wordbank('u3l1e2', "Où est l'hôtel ?", 'Where is the hotel', 'are a hospital'),
            listen('u3l1e3', 'Turn left', ['Tournez à gauche', 'Tournez à droite', 'Allez tout droit', 'Arrêtez-vous'], 'Tournez à gauche'),
            match('u3l1e4', [
              ['left', 'gauche'],
              ['right', 'droite'],
              ['straight', 'tout droit'],
              ['station', 'gare'],
            ]),
            type('u3l1e5', 'Je cherche la gare.', 'I am looking for the station', ["I'm looking for the station"]),
            choice('u3l1e6', '« near » signifie...', ['Près de', 'Loin de', 'Devant', 'Derrière'], 'Près de'),
            wordbank('u3l1e7', 'La banque est à droite.', 'The bank is on the right', 'a left of'),
            choice('u3l1e8', '« How do I get to the museum? » signifie...', ['Comment aller au musée ?', 'Où est le musée ?', 'Pourquoi le musée ?', 'Quand ouvre le musée ?'], 'Comment aller au musée ?'),
          ],
        },
        {
          id: 'u3l2',
          title: 'Se déplacer',
          icon: '🚌',
          exercises: [
            match('u3l2e1', [
              ['bus', 'bus'],
              ['train', 'train'],
              ['plane', 'avion'],
              ['car', 'voiture'],
            ]),
            wordbank('u3l2e2', 'Je prends le bus.', 'I take the bus', 'takes a train'),
            listen('u3l2e3', 'The train is late', ['Le train est en retard', "Le train est à l'heure", 'Le train est plein', 'Le train arrive'], 'Le train est en retard'),
            type('u3l2e4', 'Où est le bus ?', 'Where is the bus'),
            choice('u3l2e5', '« ticket » signifie...', ['Un billet', 'Un sac', 'Une valise', 'Un plan'], 'Un billet'),
            match('u3l2e6', [
              ['airport', 'aéroport'],
              ['ticket', 'billet'],
              ['train', 'train'],
              ['car', 'voiture'],
            ]),
            wordbank('u3l2e7', "Nous allons à l'aéroport.", 'We are going to the airport', 'is the station'),
            choice('u3l2e8', '« by train » signifie...', ['En train', 'En bus', 'En voiture', 'À pied'], 'En train'),
          ],
        },
        {
          id: 'u3l3',
          title: 'Faire des achats',
          icon: '🛍️',
          exercises: [
            choice('u3l3e1', 'Comment dit-on « Combien ça coûte ? » ?', ['How much does it cost?', 'Where is it?', 'What is it?', 'How many are there?'], 'How much does it cost?'),
            wordbank('u3l3e2', 'Je voudrais acheter cette chemise.', 'I would like to buy this shirt', 'sell that dress'),
            listen('u3l3e3', 'It is too expensive', ["C'est trop cher", "C'est bon marché", "C'est parfait", "C'est gratuit"], "C'est trop cher"),
            match('u3l3e4', [
              ['money', 'argent'],
              ['shop', 'magasin'],
              ['cheap', 'bon marché'],
              ['expensive', 'cher'],
            ]),
            type('u3l3e5', 'Je cherche un cadeau.', 'I am looking for a gift', ["I'm looking for a gift", 'I am looking for a present']),
            choice('u3l3e6', '« size » signifie...', ['La taille', 'Le prix', 'La couleur', 'La marque'], 'La taille'),
            wordbank('u3l3e7', 'Avez-vous une carte bancaire ?', 'Do you have a bank card', 'are has the'),
            choice('u3l3e8', '« cash » signifie...', ['Des espèces', 'Une carte', 'Un chèque', 'Un reçu'], 'Des espèces'),
          ],
        },
        {
          id: 'u3l4',
          title: 'Révision',
          icon: '🔁',
          exercises: [
            choice('u3l4e1', 'Que signifie « left » ?', ['Gauche', 'Droite', 'Tout droit', 'Loin'], 'Gauche'),
            wordbank('u3l4e2', 'Où est la banque ?', 'Where is the bank', 'are a shop'),
            listen('u3l4e3', 'How much does it cost?', ['Combien ça coûte ?', 'Où est-ce ?', "Qu'est-ce que c'est ?", 'Comment allez-vous ?'], 'Combien ça coûte ?'),
            match('u3l4e4', [
              ['bus', 'bus'],
              ['ticket', 'billet'],
              ['shop', 'magasin'],
              ['money', 'argent'],
            ]),
            type('u3l4e5', 'Je prends le train.', 'I take the train'),
            choice('u3l4e6', '« expensive » signifie...', ['Cher', 'Bon marché', 'Gratuit', 'Rapide'], 'Cher'),
            wordbank('u3l4e7', 'Nous allons au magasin.', 'We are going to the shop', 'is the station'),
            choice('u3l4e8', 'Comment dit-on « à droite » ?', ['On the right', 'On the left', 'Straight ahead', 'Near'], 'On the right'),
          ],
        },
      ],
    },
  ],
}

export function allLessons(c: Course) {
  return c.units.flatMap((unit) => unit.lessons.map((lesson) => ({ unit, lesson })))
}

export function findLesson(c: Course, lessonId: string) {
  return allLessons(c).find((item) => item.lesson.id === lessonId) ?? null
}

export function nextLesson(c: Course, completed: Record<string, unknown>) {
  const lessons = allLessons(c)
  const found = lessons.find(({ lesson }) => !completed[lesson.id])
  return found ? found.lesson : null
}

export function isUnlocked(c: Course, lessonId: string, completed: Record<string, unknown>) {
  const lessons = allLessons(c)
  const index = lessons.findIndex(({ lesson }) => lesson.id === lessonId)
  if (index <= 0) return index === 0
  return Boolean(completed[lessons[index - 1].lesson.id])
}

export function exerciseIndex(c: Course) {
  const map = new Map<string, { lesson: { id: string; title: string }; exercise: import('../types').Exercise }>()
  for (const { lesson } of allLessons(c)) {
    for (const exercise of lesson.exercises) {
      map.set(exercise.id, { lesson: { id: lesson.id, title: lesson.title }, exercise })
    }
  }
  return map
}
