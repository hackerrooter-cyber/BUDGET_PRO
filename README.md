# Budget Pro (packagée)

Application web de gestion de chantier avec authentification locale, désormais prêtée à être empaquetée en application de bureau Windows via Electron.

## Lancer en mode bureau

1. Ouvrez un terminal **dans le dossier du projet** (là où se trouve `package.json`).
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Démarrez l'application Electron en développement :
   ```bash
   npm run dev
   ```
   La fenêtre de bureau charge la page `index.html` existante sans nécessiter de serveur web.

## Générer un installateur Windows (.exe)

1. Sur une machine Windows avec Node.js installé, ouvrez un terminal dans le dossier du projet puis exécutez :
   ```bash
   npm install
   npm run package:win
   ```
2. L'installateur `.exe` est produit dans le dossier `dist/` par `electron-builder` (cible NSIS).

> Si `npm` signale qu'il ne trouve pas `package.json`, vérifiez que le terminal est bien positionné dans le dossier du projet (et non dans votre répertoire utilisateur).

## Structure

- `electron-main.js` : processus principal Electron qui ouvre l'interface existante et masque la barre de menus.
- `preload.js` : pont sécurisé (aucune API Node exposée) prêt pour d'éventuelles integrations futures.
- `index.html`, `style.css`, `app.js` : interface et logique originales chargées telles quelles.

## Notes de sécurité

- Le contexte de rendu est isolé (`contextIsolation` activé, `nodeIntegration` désactivé) pour limiter l'exposition aux APIs Node.
- Les dépendances de packaging (`electron`, `electron-builder`) sont listées en devDependencies ; le binaire final est généré avec `electron-builder`.
