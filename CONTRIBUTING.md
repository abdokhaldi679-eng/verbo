# Contribuer à Verbo

Merci de vouloir améliorer Verbo ! Ce projet est open source (licence MIT) et les
contributions sont bienvenues.

## Avant de commencer

- Lis [README.md](./README.md) et [DEVELOPMENT.md](./DEVELOPMENT.md).
- Pour les questions de sécurité, lis [SECURITY.md](./SECURITY.md) et ne publie jamais de
  vulnérabilité non corrigée dans une issue publique.
- Le contenu doit être **original** : aucun cours, audio, image ou asset provenant de
  Duolingo ou d’une autre application ne doit être ajouté.

## Mettre en place l’environnement

```bash
npm install
npm run dev
```

Avant d’envoyer une contribution :

```bash
npm run lint
npm run build
```

## Règles de code

- TypeScript strict, composants React fonctionnels.
- Respecte la structure existante (`src/components`, `src/data`, `src/lib`).
- Les identifiants d’exercice doivent rester uniques : ils servent de clés SRS.
- Les consignes sont localisées dans la langue maternelle ; les réponses dans la langue
  cible.
- Ne casse pas les règles de sécurité listées dans `SECURITY.md` (sandbox, IPC validé,
  CSP, pas de Node dans le renderer).

## Contenu pédagogique

- Les 20 langues utilisent le vocabulaire commun de `src/data/phrasebook.ts`.
- Les modules générés sont des découvertes A1 : ils doivent être relus par des locuteurs
  natifs avant d’être présentés comme du contenu professionnel.
- Pour le parcours français → anglais complet, édite `src/data/course.ts`.

## Proposer une modification

1. Crée une branche : `git checkout -b ma-modification`.
2. Fais des commits clairs et atomiques.
3. Ouvre une pull request en expliquant le changement et en joignant une capture si
   l’interface change.
4. Vérifie que la CI passe.

## Sécurité

- Ne commit jamais de secret, de jeton OAuth, de certificat ou de clé privée.
- Les `client_id` publics peuvent être configurés par variables d’environnement ; les
  secrets restent hors du dépôt.
- Signale toute faille selon la procédure de `SECURITY.md`.
