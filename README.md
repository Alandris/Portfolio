# Portfolio sonore — site statique pour GitHub Pages

Ce site comprend :
- Accueil (`index.html`)
- CV (`cv.html`)
- Décomposition sonore (`decomposition.html`) avec plusieurs projets à la suite, menu ancré à gauche, vidéo, lecture synchronisée de 3 pistes, commandes **M** (mute) et **S** (solo), curseur de lecture et formes d’onde
- Une rubrique supplémentaire (`autres.html`) pour les idées futures

## 1. Ajouter les médias

Chaque projet doit avoir un dossier comme celui-ci :

```
media/
  projet-01/
    video.mp4
    voix.mp3
    musique.mp3
    effets.mp3
  projet-02/
    video.mp4
    voix.mp3
    musique.mp3
    effets.mp3
```

Les vidéos fournies doivent être **sans piste sonore**, ou leur audio doit rester muet (le lecteur coupe volontairement le son de la vidéo). Les trois pistes séparées servent à reconstituer le son. Exporter chaque piste depuis **0 seconde**, même si elle commence par du silence, et avec **la même durée** que la vidéo.

Privilégier le MP3 ou autre format compressé compatible avec les navigateurs : les WAV peuvent être trop lourds. L'envoi GitHub par le navigateur est limité pour les gros fichiers ; GitHub Pages a aussi des limites de bande passante. Pour des médias volumineux, utiliser un hébergeur de fichiers/CDN externe et des URL publiques dans `data.js`.

## 2. Ajouter ou modifier un projet

Ouvrir `data.js` et modifier `window.PORTFOLIO_PROJECTS`.
- `id` : identifiant unique pour les liens du sommaire, sans espace
- `titre` : titre affiché et utilisé dans le sommaire
- `categorie` et `description` : textes de présentation
- `video` : chemin ou URL de la vidéo
- `pistes` : trois fichiers audio synchronisés, leur nom et couleur

Dupliquer un objet pour un troisième, quatrième projet, etc. Le sommaire et l'affichage se génèrent automatiquement.

## 3. Personnaliser le CV

Éditer `cv.html` puis placer votre PDF dans `assets/cv.pdf`.

## 4. Publier avec GitHub Pages

1. Créer un dépôt GitHub public (ex. `portfolio-sonore`).
2. Envoyer le contenu de ce dossier (les fichiers HTML et `data.js` doivent être à la racine du dépôt).
3. Dans **Settings > Pages**, sélectionner **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
4. Ouvrir `https://VOTRE-PSEUDO.github.io/portfolio-sonore/`.

Si le dépôt s'appelle exactement `VOTRE-PSEUDO.github.io`, la racine publique est `https://VOTRE-PSEUDO.github.io/`.

## 5. Tester en local

Pour voir les pages, il suffit d'ouvrir `index.html`. Pour que les pistes et formes d'onde soient chargées correctement, lancez un petit serveur HTTP depuis le dossier, par exemple `python -m http.server 8000` et ouvrez `http://localhost:8000`.

## Remarques techniques

- Le lecteur utilise HTML5 audio/vidéo et Canvas, **sans dépendance** à installer.
- Les vraies formes d’onde s'affichent après chargement des fichiers audio ; en leur absence, une forme d’onde indicative sert de mise en page.
- Lecture vidéo et pistes audio sont resynchronisées pendant la lecture. Pour des films très longs, un volume de fichiers important ou une synchronisation à l'échantillon près, une version plus avancée basée sur Web Audio API ou un moteur multipiste spécialisé peut être pertinente.
- Mute coupe une piste, Solo isole une ou plusieurs pistes (plusieurs S peuvent être actifs simultanément). Le bouton **Tout réactiver** rétablit les trois pistes.
