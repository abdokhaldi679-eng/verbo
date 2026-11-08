# Sécurité de Verbo

Verbo est une application locale : elle n’envoie aucune progression, aucun identifiant et
aucune donnée d’usage à un serveur. Ce document décrit les mesures en place, les limites
connues et la procédure de signalement.

Dernière mise à jour : 8 novembre 2026 — version 0.1.1.

## Versions prises en charge

| Version | Correctifs de sécurité |
| ------- | ---------------------- |
| 0.1.x   | Oui                    |

## Modèle de menace

Les actifs à protéger sont :

- la progression d’apprentissage (XP, série, historique, cartes de révision) ;
- les futures données de compte (jetons OAuth) ;
- l’intégrité de l’application installée sur Windows et Android.

Les menaces considérées sont un autre compte Windows sur la même machine, un fichier de
progression volé ou altéré, une page web malveillante chargée dans le renderer, une
injection via les données IPC, et une dépendance compromise.

## Chiffrement et stockage

### Application Windows (Electron)

- La progression est sérialisée en JSON puis chiffrée par **`safeStorage`**, qui s’appuie
  sur **DPAPI** sous Windows. Le fichier `progress.enc` est écrit dans
  `%APPDATA%\Verbo\`.
- API asynchrone (`isAsyncEncryptionAvailable`, `encryptStringAsync`,
  `decryptStringAsync`) : pas de blocage du processus principal.
- Si le système signale une rotation de clé (`shouldReEncrypt`), le fichier est
  immédiatement réécrit avec la nouvelle clé.
- Écriture atomique : fichier temporaire puis `rename`, afin d’éviter un fichier tronqué.
- Un fichier illisible n’est **jamais écrasé** : il est renommé en
  `progress.enc.corrupt-<horodatage>` pour permettre une récupération manuelle.
- Taille maximale acceptée : 2 Mio. Le JSON doit être un objet (ni tableau, ni `null`).
- En l’absence de chiffrement disponible, l’application refuse d’écrire et affiche une
  erreur ; elle ne bascule pas silencieusement vers un stockage en clair.

### Version web / PWA

- La progression utilise `localStorage` (`verbo.progress.v1`), **non chiffré**. C’est une
  limite assumée du navigateur : toute personne ayant accès au profil du navigateur ou au
  disque peut la lire.
- Aucun service worker ne met en cache des réponses d’API : il n’y a pas d’API distante.
- Le bouton d’export produit un JSON local, à conserver de façon sûre.

### Application Android (Capacitor)

- Les fichiers web sont embarqués dans l’APK et servis par le WebView local via
  `https://localhost` ; aucun contenu distant n’est chargé.
- La progression utilise le `localStorage` du WebView, isolé dans le bac à sable de
  l’application Android (**non chiffré**, comme la version web).
- `android:allowBackup="false"` : la progression n’est pas incluse dans les sauvegardes
  Android/Google.
- `android:usesCleartextTraffic="false"` : aucun trafic HTTP en clair n’est autorisé.
- Seule la permission `INTERNET` est déclarée (nécessaire au serveur local du WebView).
- La CSP du build s’applique aussi au WebView ; le service worker n’est pas enregistré dans
  la coque native puisque les fichiers sont déjà locaux.

## Durcissement Electron

- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`,
  `webviewTag: false`, `allowRunningInsecureContent: false`.
- `app.enableSandbox()` : tous les renderers, y compris les futurs, sont sandboxés.
- Preload minimal : seules trois fonctions (`load`, `save`, `clear`) sont exposées via
  `contextBridge` ; `ipcRenderer` et Node.js ne sont pas accessibles à la page.
- Chaque handler IPC vérifie l’**origine de l’expéditeur** (`senderFrame.url`) et refuse
  toute autre origine, y compris en développement.
- Les données IPC sont validées (type, taille, JSON objet) avant écriture.
- Toutes les permissions navigateur (caméra, micro, notifications, géolocalisation,
  presse-papiers, etc.) sont refusées.
- `setWindowOpenHandler` refuse toute nouvelle fenêtre ; `will-attach-webview` est bloqué.
- La navigation et les redirections hors de l’application sont bloquées.
- Les DevTools sont désactivés dans l’application empaquetée.
- **Fuses Electron** activés dans `package.json` :
  - `runAsNode: false` ;
  - `enableNodeOptionsEnvironmentVariable: false` ;
  - `enableNodeCliInspectArguments: false` ;
  - `enableCookieEncryption: true` ;
  - `enableEmbeddedAsarIntegrityValidation: true` ;
  - `onlyLoadAppFromAsar: true` ;
  - `grantFileProtocolExtraPrivileges: false`.
- **CSP** injectée au build :
  `default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self';
  form-action 'none'; frame-ancestors 'none'`, avec `connect-src 'self'`.
- **Protocole interne `app://verbo`** au lieu de `file://` : origine standard et sécurisée,
  support de la CSP, chemins validés et confinés à `dist/`. Le fuse
  `grantFileProtocolExtraPrivileges` reste désactivé.
- L’application ne charge que des ressources locales (`app://verbo` dans Electron, mêmes
  origines sur le web).

## Dépendances et audit

- Audit de production : `npm audit --omit=dev` → **0 vulnérabilité** (4 dépendances de
  production : React, React DOM et Capacitor).
- Audit complet : 11 avis **de développement uniquement** (2 low, 9 moderate), concentrés
  dans `electron-builder`, `workbox-build` et leurs dépendances transitives
  (`minimatch`, `deepmerge`). Ces paquets ne sont pas embarqués dans l’application
  installée et ne s’exécutent pas chez l’utilisateur.
- Les mises à jour correctives de ces outils seront appliquées dès qu’elles seront
  disponibles sans rupture majeure de la chaîne de build.

## Limites connues

- **Installateur non signé** : Windows SmartScreen peut afficher un avertissement. Une
  distribution publique doit signer l’exécutable avec un certificat Code Signing.
- **APK Android signé avec la clé de débogage** : il est installable pour tester, mais ne
  doit pas être publié sur le Google Play Store. Une version de production nécessite une
  clé de signature release et un bundle `.aab`.
- **Pas de mises à jour automatiques** : une nouvelle version doit être réinstallée
  manuellement.
- **Pas encore de comptes Google/Facebook** : l’OAuth (PKCE, `state`, jetons chiffrés) sera
  ajouté lorsque les identifiants développeur seront fournis. Aucun secret ne doit être
  intégré au client.
- **web/PWA** : `localStorage` n’est pas chiffré et reste lisible par du code exécuté dans
  la page. La CSP réduit fortement ce risque, mais ne le supprime pas.
- **Contenu pédagogique** : les 20 modules A1 générés doivent être relus par des locuteurs
  natifs avant une diffusion large.
- **Synthèse vocale** : dépend des voix installées dans Windows ; aucune donnée audio n’est
  envoyée à un service distant par Verbo.

## Signalement d’une vulnérabilité

Merci de **ne pas publier** une vulnérabilité non corrigée dans une issue publique.
Contacte le mainteneur du dépôt avec :

- la version concernée et le système d’exploitation ;
- une description du problème et de son impact ;
- les étapes de reproduction, si possible ;
- toute preuve de concept utile.

Un accusé de réception sera envoyé, puis un correctif et une divulgation coordonnée seront
préparés. Les rapports de bonne foi seront traités avec priorité.

## Bonnes pratiques pour les contributeurs

- Ne jamais committer de secret (client ID, secret OAuth, certificat, clé privée).
- Ne pas ajouter de `nodeIntegration`, de `remote`, ni de script distant.
- Toute nouvelle API IPC doit valider l’origine, le type et la taille des données.
- Toute nouvelle dépendance doit passer `npm audit --omit=dev` et être justifiée.
- Tester l’application empaquetée, pas seulement le serveur de développement.
