/*
 * AJOUTER OU MODIFIER LES PROJETS
 *
 * sourceUrl : adresse de la vidéo complète d'origine (facultative).
 *             Pour cacher le lien, laisse une chaîne vide : ''.
 * pisteBrute : son tel qu'il était dans la vidéo de base (Solo au départ).
 * pistes     : sons isolés/nettoyés (pas de Mute au départ).
 *
 * IMPORTANT : le fichier son-brut.mp3 est un fichier à ajouter si absent.
 * Tes fichiers Voix_1.mp3 et Voix_2.mp3 restent inchangés.
 * Respecte strictement majuscules/minuscules dans les chemins.
 */

window.PORTFOLIO_PROJECTS = [
    {
        id: 'projet-01',
        titre: 'Live_Zera_Avengers_2016',
        categorie: 'Sound design · Dialogue · Mixage',
        description: 'Écoute le son d’origine, puis explore les différentes pistes nettoyées.',

        // Exemple : 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
        // Si le champ est vide, aucun lien n'est affiché.
        sourceUrl: '',

        // La vidéo locale de l'extrait, qui reste affichée dans le lecteur.
        video: 'media/projet-01/zera.mp4',

        // NOUVEAU : exporte le son de la vidéo d'origine dans ce fichier.
        // Il sera mis en Solo automatiquement à l'ouverture de la page.
        pisteBrute: {
            nom: 'Son brut',
            fichier: 'media/projet-01/son-brut.mp3',
            couleur: '#f5ba67'
        },

        // Tes pistes découpées EXISTANTES, sans Mute au départ.
        // Elles sont silencieuses tant que le son brut est en Solo.
        pistes: [
            {
                nom: 'Voix_1',
                fichier: 'media/projet-01/Voix_1.mp3',
                couleur: '#60a5fa'
            },
            {
                nom: 'Voix_2',
                fichier: 'media/projet-01/Voix_2.mp3',
                couleur: '#c084fc'
            }
        ]
    }

    // Pour ajouter un projet plus tard, copie le bloc ci-dessus,
    // ajoute une virgule entre les projets et change son id et ses fichiers.
    // L'ancien projet 02 fictif n'est pas affiché : ses médias étaient absents.
];
