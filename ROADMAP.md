# Feuille de route de Verbo

## Vision

Faire de Verbo une **grande application open source d’apprentissage des langues** : 20 langues,
du contenu original relu par des locuteurs natifs, une expérience soignée sur Windows, Android
et web, et le respect de la vie privée.

## Principes

- **Contenu original** : aucun cours, audio, image ou asset repris d’une autre application.
- **Local-first** : la progression reste sur l’appareil, sans serveur obligatoire.
- **Open source (MIT)** : le code, les cours et la feuille de route sont publics.
- **Qualité avant quantité** : mieux vaut 20 modules relus que 200 modules approximatifs.
- **Accessibilité** : clavier, lecteurs d’écran, contraste et animations réduites.

## Où en est le projet

| Version | État | Contenu |
| --- | --- | --- |
| 0.1.x | publiée | 20 langues, parcours français → anglais, modules Découverte A1, Windows, PWA, Android, sécurité, CI et releases automatiques |

## Prochaines étapes

### 0.2 — Contenu et qualité (priorité)

- Relire les 20 modules A1 avec des **locuteurs natifs**.
- Étendre chaque module de découverte (5 leçons) vers un vrai niveau A1.
- Traduire l’interface dans les langues disponibles (commencer par l’anglais).
- Ajouter les tests **Vitest** (SRS, normalisation, génération de cours) et **Playwright**
  (parcours complet).
- Mode sombre, audit d’accessibilité et statistiques détaillées.
- Indicateurs : 20 modules relus, tests verts sur chaque PR, aucun bug critique ouvert.

### 0.3 — Comptes et synchronisation

- Connexion **Google / Facebook** avec Authorization Code + PKCE.
- Synchronisation chiffrée entre appareils, facultative et désactivable.
- Import de progression et gestion complète du compte.
- Prérequis : identifiants développeur Google et Meta.

### 0.4 — Distribution professionnelle

- Publication sur **Google Play** avec un bundle `.aab` signé.
- **Installateur Windows signé** et mises à jour automatiques.
- Version **iOS** via Capacitor.
- Paquets **Linux** (AppImage et `.deb`).

### 1.0 — Grande application

- Niveaux A1 à B1 avec un parcours complet et des révisions intelligentes.
- Statistiques avancées, objectifs personnalisés et rappels.
- Contribution communautaire de cours, avec validation par des natifs.
- Internationalisation complète et accessibilité certifiée.
- API publique et documentation pour les contributeurs.

## Comment aider

| Profil | Ce qu’il peut faire |
| --- | --- |
| Développeur React / TypeScript | interface, exercices, statistiques, tests |
| Développeur Android / Electron | APK, Play Store, Windows, mises à jour |
| Locuteur natif | relire les traductions et les consignes des 20 langues |
| Designer UI/UX | parcours, accessibilité, icônes, captures |
| Traducteur | interface et documentation |
| Testeur | Windows, Android, navigateurs, appareils anciens |

Les tâches sont dans les [issues](https://github.com/abdokhaldi679-eng/verbo/issues), les
questions dans les [discussions](https://github.com/abdokhaldi679-eng/verbo/discussions), et
les règles dans [CONTRIBUTING.md](./CONTRIBUTING.md).

Les priorités peuvent évoluer : cette feuille de route est un document vivant, mis à jour à
chaque release.
