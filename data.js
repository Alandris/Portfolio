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
        titre: 'Zerator_Live_Avengers_2016',
        categorie: 'Voix | Musique | Bruits',
        description: '',

        // Exemple : 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
        // Si le champ est vide, aucun lien n'est affiché.
        sourceUrl: '',

        // La vidéo locale de l'extrait, qui reste affichée dans le lecteur.
        video: 'media/projet-01/Zevent_2016_clip_100k€_VIDEO.mp4',

  
        // Son d'origine. Il sera mis en Solo automatiquement à l'ouverture de la page.
        pisteBrute: {
            nom: 'Brut',
            fichier: 'media/projet-01/Zevent_2016_clip_100k€_AUDIO.m4a',
            couleur: '#f56767ff'
        },

        // Tes pistes découpées EXISTANTES, sans Mute au départ.
        // Elles sont silencieuses tant que le son brut est en Solo.
        pistes: [
            {
                nom: 'Voix',
                fichier: 'media/projet-01/Zevent_2016_clip_100k€_AUDIO_zera_clean2.m4a',
                couleur: '#60a5fa'
            },
            {
                nom: 'Musique',
                fichier: 'media/projet-01/Zevent_2016_clip_100k€_AUDIO_music_clean.m4a',
                couleur: '#84fc84ff'
            },
            {
                nom: 'Autre',
                fichier: 'media/projet-01/Zevent_2016_clip_100k€_AUDIO_sfx_clean2.m4a',
                couleur: '#f76c10ff'
            }
        ]
    },
    {
        id: 'projet-02',
        titre: 'Amixem_100_Couches_Beton',
        categorie: 'Voix | Musique | Bruits',
        description: '',

        // Exemple : 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
        // Si le champ est vide, aucun lien n'est affiché.
        sourceUrl: 'https://youtu.be/-3AfCwgcH5I?si=GtchOrnAZa5NCSi9&t=1570',

        // La vidéo locale de l'extrait, qui reste affichée dans le lecteur.
        video: 'media/projet-02/Amixem_100_Couches_Beton_CUT_VIDEO.mp4',

  
        // Son d'origine. Il sera mis en Solo automatiquement à l'ouverture de la page.
        pisteBrute: {
            nom: 'Brut',
            fichier: 'media/projet-02/Amixem_100_Couches_Beton_CUT_AUDIO.m4a',
            couleur: '#f56767ff'
        },

        // Tes pistes découpées EXISTANTES, sans Mute au départ.
        // Elles sont silencieuses tant que le son brut est en Solo.
        pistes: [
            {
                nom: 'Voix',
                fichier: 'media/projet-02/Amixem_100_Couches_Beton_CUT_AUDIO_speech_clean.m4a',
                couleur: '#60a5fa'
            },
            {
                nom: 'Musique',
                fichier: 'media/projet-02/Amixem_100_Couches_Beton_CUT_AUDIO_music_clean.m4a',
                couleur: '#84fc84ff'
            },
            {
                nom: 'Autre',
                fichier: 'media/projet-02/Amixem_100_Couches_Beton_CUT_AUDIO_sfx_clean.m4a',
                couleur: '#f76c10ff'
            }
        ]
    },
    {
        id: 'projet-03',
        titre: 'Lethal_Company',
        categorie: 'Chevauchements voix | Musique | Bruits',
        description: '',

        // Exemple : 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
        // Si le champ est vide, aucun lien n'est affiché.
        sourceUrl: 'https://youtu.be/9XxzKJsob4s?si=82a7gW6jlfnydsGP&t=534',

        // La vidéo locale de l'extrait, qui reste affichée dans le lecteur.
        video: 'media/projet-03/JDG_LETHAL_COMPANY_CUT_VIDEO.mp4',

  
        // Son d'origine. Il sera mis en Solo automatiquement à l'ouverture de la page.
        pisteBrute: {
            nom: 'Brut',
            fichier: 'media/projet-03/JDG_LETHAL_COMPANY_CUT_AUDIO.m4a',
            couleur: '#f56767ff'
        },

        // Tes pistes découpées EXISTANTES, sans Mute au départ.
        // Elles sont silencieuses tant que le son brut est en Solo.
        pistes: [
            {
                nom: 'JDG',
                fichier: 'media/projet-03/JDG_LETHAL_COMPANY_CUT_AUDIO_JDG.m4a',
                couleur: '#60a5fa'
            },
            {
                nom: 'Antoine',
                fichier: 'media/projet-03/JDG_LETHAL_COMPANY_CUT_AUDIO_Antoine.m4a',
                couleur: '#c084fc'
            },
            {
                nom: 'Mynthos',
                fichier: 'media/projet-03/JDG_LETHAL_COMPANY_CUT_AUDIO_Mynthos.m4a',
                couleur: '#e9db1dff'
            },
            {
                nom: 'Horty',
                fichier: 'media/projet-03/JDG_LETHAL_COMPANY_CUT_AUDIO_Horty.m4a',
                couleur: '#25d8f8ff'
            },
            {
                nom: 'Musique',
                fichier: 'media/projet-03/JDG_LETHAL_COMPANY_CUT_AUDIO_music_clean.m4a',
                couleur: '#84fc84ff'
            },
            {
                nom: 'Autre',
                fichier: 'media/projet-03/JDG_LETHAL_COMPANY_CUT_AUDIO_sfx_clean.m4a',
                couleur: '#f76c10ff'
            }
        ]
    }

    // Pour ajouter un projet plus tard, copie le bloc ci-dessus,
    // ajoute une virgule entre les projets et change son id et ses fichiers.
];
