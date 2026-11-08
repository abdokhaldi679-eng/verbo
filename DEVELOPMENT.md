# Guide développeur — Verbo

Ce document résume tout ce qu’il faut savoir pour reprendre, modifier et distribuer Verbo.

## 1. Prérequis

- Windows 10/11 (le code web fonctionne aussi sur macOS/Linux).
- **Node.js 22+** et npm.
- Un éditeur (VS Code recommandé).
- Pour Android : **Java 21**, **SDK Android 36** et Android Studio (facultatif pour la CI).

## 2. Démarrer

```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

Autres commandes :

```bash
npm run build      # TypeScript + build de production dans dist/
npm run lint       # oxlint
npm run desktop    # build + lancement Electron
npm run build:win  # build + installateur Windows dans release/
npm run android:sync  # build web + synchronisation du projet Android
npm run android:open  # ouvre android/ dans Android Studio
npm run preview    # prévisualise dist/
```

## 3. Architecture

```
electron/main.cjs      processus principal : fenêtre, IPC, coffre DPAPI, protocole app://
electron/preload.cjs   bridge minimal (load/save/clear)
android/               projet Android natif généré par Capacitor (sources versionnées)
capacitor.config.ts    identifiant, nom et configuration de la coque Android
src/data/              contenu pédagogique et catalogue des langues
src/lib/               état global, XP, SRS, audio, normalisation
src/components/        interface React
src/styles.css         styles globaux
build/                 icône Windows et génération des visuels Android
```

Points importants :

- La paire **français → anglais** utilise le parcours complet de `src/data/course.ts`.
- Toutes les autres paires utilisent `src/data/generateCourse.ts`, alimenté par
  `src/data/phrasebook.ts` (20 phrases × 20 langues) et `src/data/instructions.ts`.
- `src/data/courses.ts` choisit le cours selon la paire.
- La progression est dans `ProgressState` (`src/lib/progress.tsx`) : XP, série, leçons,
  cartes SRS et langues choisies.

## 4. Ajouter du contenu

### Une phrase commune à toutes les langues

1. Ajoute un identifiant dans `PhraseId` (`src/data/phrasebook.ts`).
2. Ajoute ses traductions pour les 20 langues dans `PHRASES`.
3. Référence-la dans un groupe de `LESSON_GROUPS` (`src/data/generateCourse.ts`).

### Une langue

1. Ajoute le code, le nom, la locale TTS et les options d’écriture dans
   `src/data/languages.ts`.
2. Complète ses traductions dans `phrasebook.ts`.
3. Complète ses consignes dans `instructions.ts`.
4. Vérifie l’affichage des alphabets non latins et le sens d’écriture (arabe).

### Le parcours anglais complet

Édite directement `src/data/course.ts`. Les identifiants d’exercice doivent rester uniques :
ils servent de clés de répétition espacée.

## 5. Sécurité — règles à ne pas casser

- `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`.
- Ne jamais exposer `ipcRenderer`, `require` ou `fs` au renderer.
- Toute nouvelle API IPC doit valider l’origine (`senderFrame.url`), le type et la taille
  des données.
- Les permissions navigateur sont refusées par défaut.
- La CSP est injectée au build dans `vite.config.ts`.
- L’application est servie par `app://verbo`, pas par `file://` ; les chemins sont confinés
  à `dist/`.
- Les fuses Electron sont définis dans `package.json` (`electronFuses`).
- Android : `android:allowBackup="false"`, `android:usesCleartextTraffic="false"` et aucune
  permission superflue (seulement `INTERNET`, requis par le WebView local).
- Ne jamais committer de secret (client ID, secret OAuth, certificat, clé de signature).

Détails et limites : voir [SECURITY.md](./SECURITY.md).

## 6. Connexion Google / Facebook (à brancher)

L’OAuth n’est **pas encore implémenté** : il manque les identifiants développeur.

Pour l’activer :

1. Créer une application dans **Google Cloud Console** (API « Google Identity ») et une
   application dans **Meta for Developers**.
2. Configurer les URI de redirection (par exemple `http://127.0.0.1:5173/auth/callback`
   en développement, et un schéma profond `verbo://auth/callback` pour le desktop).
3. Fournir les `client_id` (publics) au projet ; les secrets ne doivent **jamais** être
   embarqués dans le client desktop.
4. Implémenter le flux **Authorization Code + PKCE** avec un paramètre `state` aléatoire,
   puis stocker les jetons chiffrés via `safeStorage` (même coffre que la progression).
5. Ajouter un écran de compte et la déconnexion.

## 7. Tests avant livraison

```bash
npm run lint
npm run build
npm run build:win
npm run android:sync
```

Vérifier ensuite :

- l’installation sur un profil Windows vierge ;
- la création de `%APPDATA%\Verbo\progress.enc` ;
- la relance de l’application (déchiffrement de la progression) ;
- une leçon complète dans au moins deux paires de langues ;
- l’absence d’erreur dans la console (DevTools désactivés en production) ;
- l’installation de l’APK Android et une leçon complète sur un appareil ou un émulateur.

## 8. Distribution

- L’installateur Windows est généré dans `release/Verbo Setup 0.1.1.exe`.
- Il n’est pas signé : SmartScreen peut afficher un avertissement.
- Pour une diffusion publique, signer l’exécutable avec un certificat Code Signing et
  mettre en place des mises à jour signées.
- Android : le workflow `.github/workflows/android-apk.yml` construit un APK de test
  (`Verbo-<version>-android-debug.apk`) et le joint à la release GitHub. Pour le Play Store,
  générer un `.aab` release signé et conserver la clé hors du dépôt.

## 9. Licence

MIT — voir [LICENSE](./LICENSE). Le contenu pédagogique ajouté reste sous la
responsabilité de ses auteurs.
