import type { LanguageCode } from './languages'

export interface ExerciseInstructions {
  choice: string
  wordbank: string
  listen: string
  match: string
  type: string
}

export const INSTRUCTIONS: Record<LanguageCode, ExerciseInstructions> = {
  fr: {
    choice: 'Choisis la bonne réponse',
    wordbank: 'Traduis cette phrase',
    listen: 'Écoute et choisis la bonne traduction',
    match: 'Associe les paires',
    type: 'Écris la traduction',
  },
  en: {
    choice: 'Choose the correct answer',
    wordbank: 'Translate this sentence',
    listen: 'Listen and choose the correct translation',
    match: 'Match the pairs',
    type: 'Write the translation',
  },
  es: {
    choice: 'Elige la respuesta correcta',
    wordbank: 'Traduce esta frase',
    listen: 'Escucha y elige la traducción correcta',
    match: 'Une las parejas',
    type: 'Escribe la traducción',
  },
  de: {
    choice: 'Wähle die richtige Antwort',
    wordbank: 'Übersetze diesen Satz',
    listen: 'Höre zu und wähle die richtige Übersetzung',
    match: 'Verbinde die Paare',
    type: 'Schreibe die Übersetzung',
  },
  it: {
    choice: 'Scegli la risposta corretta',
    wordbank: 'Traduci questa frase',
    listen: 'Ascolta e scegli la traduzione corretta',
    match: 'Abbina le coppie',
    type: 'Scrivi la traduzione',
  },
  pt: {
    choice: 'Escolhe a resposta correta',
    wordbank: 'Traduz esta frase',
    listen: 'Ouve e escolhe a tradução correta',
    match: 'Associa os pares',
    type: 'Escreve a tradução',
  },
  nl: {
    choice: 'Kies het juiste antwoord',
    wordbank: 'Vertaal deze zin',
    listen: 'Luister en kies de juiste vertaling',
    match: 'Verbind de paren',
    type: 'Schrijf de vertaling',
  },
  pl: {
    choice: 'Wybierz poprawną odpowiedź',
    wordbank: 'Przetłumacz to zdanie',
    listen: 'Posłuchaj i wybierz poprawne tłumaczenie',
    match: 'Połącz pary',
    type: 'Napisz tłumaczenie',
  },
  sv: {
    choice: 'Välj rätt svar',
    wordbank: 'Översätt meningen',
    listen: 'Lyssna och välj rätt översättning',
    match: 'Matcha paren',
    type: 'Skriv översättningen',
  },
  ru: {
    choice: 'Выбери правильный ответ',
    wordbank: 'Переведи это предложение',
    listen: 'Послушай и выбери правильный перевод',
    match: 'Соедини пары',
    type: 'Напиши перевод',
  },
  uk: {
    choice: 'Обери правильну відповідь',
    wordbank: 'Переклади це речення',
    listen: 'Послухай і обери правильний переклад',
    match: 'З’єднай пари',
    type: 'Напиши переклад',
  },
  tr: {
    choice: 'Doğru cevabı seç',
    wordbank: 'Bu cümleyi çevir',
    listen: 'Dinle ve doğru çeviriyi seç',
    match: 'Eşleştir',
    type: 'Çeviriyi yaz',
  },
  ar: {
    choice: 'اختر الإجابة الصحيحة',
    wordbank: 'ترجم هذه الجملة',
    listen: 'استمع واختر الترجمة الصحيحة',
    match: 'طابق الأزواج',
    type: 'اكتب الترجمة',
  },
  zh: {
    choice: '选择正确答案',
    wordbank: '翻译这句话',
    listen: '听并选择正确的翻译',
    match: '配对',
    type: '写出翻译',
  },
  ja: {
    choice: '正しい答えを選んでください',
    wordbank: 'この文を翻訳してください',
    listen: '聞いて正しい翻訳を選んでください',
    match: 'ペアを合わせてください',
    type: '翻訳を書いてください',
  },
  ko: {
    choice: '올바른 답을 고르세요',
    wordbank: '이 문장을 번역하세요',
    listen: '듣고 올바른 번역을 고르세요',
    match: '짝을 맞추세요',
    type: '번역을 쓰세요',
  },
  el: {
    choice: 'Διάλεξε τη σωστή απάντηση',
    wordbank: 'Μετάφρασε αυτή τη φράση',
    listen: 'Άκουσε και διάλεξε τη σωστή μετάφραση',
    match: 'Ταίριαξε τα ζευγάρια',
    type: 'Γράψε τη μετάφραση',
  },
  hi: {
    choice: 'सही उत्तर चुनें',
    wordbank: 'इस वाक्य का अनुवाद करें',
    listen: 'सुनें और सही अनुवाद चुनें',
    match: 'जोड़ियाँ मिलाएँ',
    type: 'अनुवाद लिखें',
  },
  vi: {
    choice: 'Chọn câu trả lời đúng',
    wordbank: 'Dịch câu này',
    listen: 'Nghe và chọn bản dịch đúng',
    match: 'Ghép các cặp',
    type: 'Viết bản dịch',
  },
  id: {
    choice: 'Pilih jawaban yang benar',
    wordbank: 'Terjemahkan kalimat ini',
    listen: 'Dengarkan dan pilih terjemahan yang benar',
    match: 'Cocokkan pasangan',
    type: 'Tulis terjemahannya',
  },
}
