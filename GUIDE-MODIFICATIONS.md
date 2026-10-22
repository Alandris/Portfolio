# Modifier ton portfolio (sans être développeur)

## Quels fichiers modifier ?

- `index.html` : textes de l’accueil.
- `cv.html` : toutes les informations de ton CV.
- `decomposition.html` : titre et introduction de la page des projets.
- `autres.html` : future rubrique.
- `data.js` : **liste de tes projets** (titre, description, vidéo, pistes).
- `style.css` : **couleurs, polices, espacements et apparence**.
- `player.js` : fonctionnement du lecteur, **évite de le modifier** tant que tu débutes.

Tous les fichiers HTML et CSS sont formatés sur plusieurs lignes pour faciliter l’édition.

## Ajouter un projet

1. Copie le dossier `media/projet-01/` en `media/projet-03/`.
2. Mets-y ta vidéo `video.mp4` et les pistes `voix.mp3`, `musique.mp3`, `effets.mp3`.
3. Dans `data.js`, copie le dernier objet projet (de `{` à `}`) avant le crochet final `]`.
4. Place une virgule entre les objets. Change `id`, `titre`, `description` et les chemins vers `media/projet-03/`.
5. Enregistre : le menu de gauche et la section du projet seront générés automatiquement.

Les pistes doivent être exportées depuis 0:00, synchronisées et de la même durée que la vidéo. La vidéo est lue sans son : ce sont les trois fichiers audio qui produisent le mix.

## Changer les couleurs

Dans le début de `style.css`, cherche `:root`. Tu y trouveras notamment `--bg` (fond), `--text` (texte), `--accent` (couleur d’accent).

## Tester le site en local

Installe **Visual Studio Code** puis ouvre le dossier complet du site. Utilise une extension serveur local telle que « Live Server » (ou lance `python -m http.server 8000` dans ce dossier), puis ouvre `http://localhost:8000`.

Ne te fie pas à un test en ouvrant simplement le fichier HTML avec `file://` : le chargement de certains médias et l’analyse des formes d’onde peuvent être bloqués par le navigateur.

## Publier sur GitHub Pages

1. Crée un dépôt GitHub public, par exemple `portfolio-sonore`.
2. Mets **le contenu de ce dossier à la racine** du dépôt (pas de sous-dossier de trop).
3. Va dans **Settings → Pages → Build and deployment** et choisis « Deploy from a branch », `main` et `/ (root)`.
4. Le site sera accessible à une adresse de la forme `https://pseudo.github.io/portfolio-sonore/`.
5. Pour modifier le site, enregistre tes fichiers, puis publie les changements dans le même dépôt.

Attention : pour des vidéos volumineuses, les limites de taille de GitHub peuvent poser problème. Dans ce cas, les héberger à part et utiliser une URL accessible publiquement.

## Comment reprendre notre travail dans ChatGPT ?

### Méthode conseillée

Garde **un seul dépôt GitHub** comme version de référence et évite d’avoir plusieurs dossiers « version finale 2 ».

À chaque nouvelle séance :

1. Reviens dans cette conversation si tu peux, et joins le ZIP de la **dernière version du site** (ou les fichiers que tu as modifiés).
2. Dis ce que tu veux changer, par exemple : « Ajoute une page contact, garde les lecteurs Mute/Solo et la navigation gauche ».
3. Je pourrai lire ces fichiers, les modifier et te redonner un ZIP prêt à remplacer dans ton dépôt.

Dans une nouvelle conversation, **joins impérativement le ZIP le plus récent**, ainsi que les consignes essentielles : ChatGPT ne dispose pas systématiquement des anciens fichiers ou de l’historique complet.

### Exemple de message à copier

« Voici le ZIP de mon portfolio sonore hébergé sur GitHub Pages. Il contient Accueil, CV, Décomposition sonore (vidéos + voix/musique/effets avec Mute/Solo, liste des projets à gauche), Autres projets. Garde la structure et les fonctions existantes. Modifie uniquement [ce que je demande] et rends-moi un ZIP avec les fichiers modifiables et bien indentés. »

### Important

Ne joins pas de mots de passe, de jetons d’accès GitHub ni d’autres informations privées. Un lien vers un dépôt public convient également, mais le ZIP de la version exacte évite les écarts entre fichiers.
