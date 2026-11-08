# Verbo 🦜

[![CI](https://github.com/abdokhaldi679-eng/verbo/actions/workflows/ci.yml/badge.svg)](https://github.com/abdokhaldi679-eng/verbo/actions/workflows/ci.yml)
[![Licence MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](./LICENSE)

Application **open source** d’apprentissage des langues, inspirée des applications gamifiées
(XP, séries, parcours en unités) mais avec **ton propre contenu**.

Dépôt : [github.com/abdokhaldi679-eng/verbo](https://github.com/abdokhaldi679-eng/verbo)

Démo web : [abdokhaldi679-eng.github.io/verbo](https://abdokhaldi679-eng.github.io/verbo/)

Le projet est une **PWA** : une seule base de code, installable sur Windows, Android, iOS et
Linux depuis le navigateur, et utilisable hors-ligne après la première visite.

> Verbo est un projet indépendant, sans aucun lien avec Duolingo. Aucun code, cours, audio
> ou ressource de Duolingo n’est utilisé.

## Fonctionnalités

- **20 langues** : l’utilisateur choisit sa langue maternelle et la langue qu’il veut
  apprendre. Les consignes sont affichées dans la langue maternelle, les réponses dans la
  langue cible.
- **Parcours par unités et leçons** avec déblocage progressif.
- **5 types d’exercices** :
  - choix multiple ;
  - traduction avec banque de mots ;
  - compréhension orale (voix du navigateur) ;
  - association de paires ;
  - saisie libre avec variantes acceptées.
- **Gamification** : XP, objectif quotidien, série de jours, écran de fin de leçon.
- **Répétition espacée** : chaque exercice a une échéance calculée à partir de tes réussites
  et de tes erreurs ; l’onglet Réviser propose les exercices dus.
- **100 % local** : aucune donnée n’est envoyée à un serveur. Dans le navigateur, la
  progression utilise `localStorage` ; dans l’application Windows, elle est **chiffrée par
  Windows (DPAPI)** dans `%APPDATA%\Verbo\progress.enc`.
- **Hors-ligne** : service worker généré par `vite-plugin-pwa`.
- **Accessibilité** : navigation clavier, boutons et libellés ARIA, respect de
  `prefers-reduced-motion`.

## Démarrage

Prérequis : Node.js 22+ (testé avec Node 26) et npm.

```bash
npm install
npm run dev        # serveur de développement sur http://localhost:5173
npm run build      # vérification TypeScript + build de production
npm run preview    # prévisualiser le build
```

Le build de production est généré dans `dist/`. C’est un site statique : tu peux le déployer
sur GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.

> Pour GitHub Pages sous un sous-chemin, le projet utilise déjà `base: './'` ; vérifie
> simplement `start_url` / `scope` dans `vite.config.ts`.

## Application de bureau Windows

Verbo est aussi empaqueté avec **Electron** : la même base de code devient une application
Windows autonome, sans navigateur visible.

```bash
npm run desktop     # build + lance l'app desktop
npm run build:win   # build + génère l'installateur Windows
```

Résultat dans `release/` :

- `release/win-unpacked/Verbo.exe` : version portable, à lancer directement ;
- `release/Verbo Setup 0.1.0.exe` : installateur NSIS (choix du dossier, raccourcis bureau
  et menu Démarrer).

L’application charge `dist/index.html` via le protocole interne `app://verbo`, toutes les
ressources sont embarquées : elle fonctionne sans Internet. La progression est stockée dans
`%APPDATA%\Verbo\progress.enc` et chiffrée via `safeStorage` (DPAPI Windows). Le renderer
tourne en sandbox, sans accès à Node.js ; seules trois opérations de stockage validées sont
exposées par le preload. Voir [SECURITY.md](./SECURITY.md).

L’installateur n’est pas signé : Windows SmartScreen peut afficher un avertissement au
premier lancement. Pour une distribution publique, signe l’exécutable avec un certificat
Code Signing.

### Audio et exercices d’écoute

Les exercices d’écoute utilisent la synthèse vocale du système (`speechSynthesis`). Sur
Windows, Chromium s’appuie sur les voix installées dans **Paramètres → Heure et langue →
Parole**. Si tu n’entends rien, ajoute une voix anglaise (par exemple *English (United
States)*) et vérifie le périphérique de sortie sélectionné.

## Structure du projet

```
verbo/
├─ electron/
│  ├─ main.cjs              # fenêtre Electron, IPC, coffre DPAPI, durcissement
│  └─ preload.cjs           # bridge contextBridge minimal
├─ build/icon.ico           # icône de l'installateur Windows
├─ public/                  # icônes PWA, favicon
├─ src/
│  ├─ components/
│  │  ├─ exercises/         # les 5 vues d’exercices
│  │  ├─ Home.tsx           # parcours, hero, progression
│  │  ├─ LanguageSetup.tsx  # choix langue maternelle / langue apprise
│  │  ├─ LessonPlayer.tsx   # moteur de session (file, erreurs, XP)
│  │  ├─ CompleteScreen.tsx
│  │  ├─ Review.tsx         # exercices dus (répétition espacée)
│  │  ├─ Profile.tsx        # stats, objectif, langues, export, reset
│  │  └─ TopBar.tsx
│  ├─ data/
│  │  ├─ course.ts          # parcours complet français → anglais (96 exercices)
│  │  ├─ languages.ts       # catalogue des 20 langues
│  │  ├─ phrasebook.ts      # 20 phrases × 20 langues
│  │  ├─ instructions.ts    # consignes localisées
│  │  ├─ generateCourse.ts  # générateur de module A1
│  │  └─ courses.ts         # sélection du cours selon la paire
│  ├─ lib/
│  │  ├─ progress.tsx       # état global + XP + série + persistance
│  │  ├─ stats.ts           # séries, XP du jour, révisions dues
│  │  ├─ srs.ts             # calcul des intervalles de révision
│  │  ├─ audio.ts           # synthèse vocale multilingue
│  │  ├─ normalize.ts       # correction des réponses (alphabets non latins)
│  │  └─ date.ts
│  ├─ types.ts
│  ├─ App.tsx
│  └─ styles.css
├─ SECURITY.md              # audit et mesures de sécurité
├─ vite.config.ts           # configuration PWA (manifest + service worker + CSP)
└─ package.json             # scripts web + Electron + electron-builder
```

## Ajouter ou modifier des cours

Le parcours complet français → anglais vit dans `src/data/course.ts`. Les autres paires de
langues sont générées à partir de `src/data/phrasebook.ts` (20 phrases traduites dans les
20 langues) et des consignes de `src/data/instructions.ts`. Pour enrichir le contenu
commun, ajoute des phrases au phrasebook ; pour enrichir le parcours anglais, édite
directement `course.ts`.

Une unité contient des leçons, une leçon contient des exercices. Les identifiants
(`fr-es-a1-l1e1`, `u1l1e1`, …) doivent être **uniques** : ils servent de clés pour la
répétition espacée.

```ts
{
  id: 'u1l1e1',
  type: 'choice',
  instruction: 'Choisis la bonne réponse',
  question: 'Que signifie « hello » ?',
  options: ['Bonjour', 'Au revoir', 'Merci', 'Pardon'],
  answer: 'Bonjour',
}
```

Types disponibles :

| Type       | Champs principaux                                                |
| ---------- | ---------------------------------------------------------------- |
| `choice`   | `question`, `options[]`, `answer`                                 |
| `wordbank` | `question`, `answer[]`, `distractors[]`                           |
| `listen`   | `text` (prononcé), `options[]`, `answer`                          |
| `match`    | `pairs[]` avec `left` / `right`                                   |
| `type`     | `question`, `answer`, `accepted[]` (variantes)                    |

Des fonctions utilitaires (`choice`, `wordbank`, `listen`, `match`, `type`) sont définies en
haut du fichier pour écrire le contenu plus vite.

Pour ajouter une nouvelle langue, ajoute-la dans `src/data/languages.ts`, complète ses
traductions dans `src/data/phrasebook.ts` et ses consignes dans `src/data/instructions.ts`.
La synthèse vocale utilise automatiquement la locale de la langue cible.

## Comment fonctionne la progression

- **XP** : 10 XP par leçon (5 en révision) + bonus de 5 XP si 100 % de réussite, 3 XP si ≥ 80 %.
- **Objectif quotidien** : réglable dans le profil (10, 20, 30 ou 50 XP).
- **Série** : +1 le premier jour actif, conservée si tu reviens le lendemain.
- **Répétition espacée** : réussite → intervalle 1 jour, 3 jours, puis `intervalle × facilité` ;
  erreur → retour dès le lendemain et facilité réduite. Chaque exercice est suivi
  individuellement.
- **Stockage** : clé `verbo.progress.v1` dans `localStorage` sur le web ; fichier chiffré
  `progress.enc` (DPAPI) dans l’application Windows. Le bouton « Exporter ma progression »
  télécharge un JSON ; « Réinitialiser » efface tout.

## PWA et installation

- Le manifeste et le service worker sont générés au build par `vite-plugin-pwa`.
- Sur Chrome/Edge : icône d’installation dans la barre d’adresse.
- Sur iPhone : Partager → « Sur l’écran d’accueil ».
- Sur Windows, tu peux aussi empaqueter le site en MSIX avec
  [PWABuilder](https://www.pwabuilder.com/) — c’est exactement le principe du paquet Duolingo
  que tu as fourni : un manifeste Edge PWA, sans le code de l’application.

## Feuille de route possible

- Connexion Google / Facebook et synchronisation de la progression : l’implémentation OAuth
  (PKCE, `state`, jetons chiffrés) est prête à être branchée dès réception des identifiants
  développeur Google et Meta.
- Relecture des 20 modules A1 par des locuteurs natifs et enrichissement du contenu.
- Plus de cours et de langues (contenu communautaire).
- Audio enregistré ou TTS local (Piper) pour un rendu plus naturel.
- Ligues, quêtes et succès.
- Mode sombre.
- Tests unitaires du moteur (`vitest`) et tests E2E (`playwright`).

## Licence

MIT — voir [LICENSE](./LICENSE). Tu peux réutiliser, modifier et distribuer le code, y compris
commercialement, en conservant la mention de licence. Le **contenu pédagogique** que tu ajoutes
reste sous ta responsabilité.
