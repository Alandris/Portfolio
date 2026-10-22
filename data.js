// FICHIER PRINCIPAL POUR AJOUTER OU MODIFIER TES PROJETS.
// 1. Duplique un bloc entre { et } dans la liste ci-dessous.
// 2. Donne-lui un identifiant unique (id), un titre et une description.
// 3. Place les fichiers audio/video dans le dossier media correspondant.
// 4. Attention aux virgules entre les projets.
//
// Modifie ce fichier pour présenter tes projets.
// Les chemins sont relatifs à la racine du site.
window.PORTFOLIO_PROJECTS = [
  {
    id: 'projet-01',
    titre: 'Live_Zera_Avengers_2016',
    categorie: 'Sound design · Dialogue · Mixage',
    description: 'Un exemple de décomposition sonore : isole les voix, la musique et les effets pour comprendre le travail effectué.',
    video: 'media/projet-01/zera.mp4',
    pistes: [
      { nom: 'Voix_1', fichier: 'media/projet-01/voix_1.mp3', couleur: '#60a5fa' },
      { nom: 'Voix_2', fichier: 'media/projet-01/voix_2.mp3', couleur: '#c084fc' }
    ]
  },
  {
    id: 'projet-02',
    titre: 'Projet 02 — Ambiance sonore',
    categorie: 'Création sonore · Ambiances',
    description: 'Un deuxième emplacement prêt à accueillir une autre vidéo et ses trois pistes synchronisées.',
    video: 'media/projet-02/video.mp4',
    pistes: [
      { nom: 'Voix', fichier: 'media/projet-02/voix.mp3', couleur: '#60a5fa' },
      { nom: 'Musique', fichier: 'media/projet-02/musique.mp3', couleur: '#c084fc' },
      { nom: 'Effets', fichier: 'media/projet-02/effets.mp3', couleur: '#34d399' }
    ]
  }
];
