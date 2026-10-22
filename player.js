
 // Lecteur audio/vidéo multipiste pour le portfolio.
 // Pas de bibliothèque externe nécessaire.
 // Le son est lancé directement depuis le clic de l'utilisateur.

 const projets = window.PORTFOLIO_PROJECTS || [];
 const nav = document.getElementById('project-nav');
 const conteneur = document.getElementById('projects');
 const instances = [];

 function e(tag, classe = '', texte) {
     const element = document.createElement(tag);
     if (classe) element.className = classe;
     if (texte !== undefined) element.textContent = texte;
     return element;
 }

 function temps(secondes) {
     if (!Number.isFinite(secondes)) return '00:00';
     const minutes = String(Math.floor(secondes / 60)).padStart(2, '0');
     const reste = String(Math.floor(secondes % 60)).padStart(2, '0');
     return `${minutes}:${reste}`;
 }

 function dessine(canvas, couleur, niveaux, progression, actif) {
     const rectangle = canvas.getBoundingClientRect();
     const ratio = window.devicePixelRatio || 1;
     const largeur = Math.max(1, Math.round(rectangle.width * ratio));
     const hauteur = Math.max(1, Math.round(rectangle.height * ratio));

     if (canvas.width !== largeur || canvas.height !== hauteur) {
         canvas.width = largeur;
         canvas.height = hauteur;
     }

     const contexte = canvas.getContext('2d');
     contexte.clearRect(0, 0, largeur, hauteur);
     const largeurBarre = largeur / niveaux.length;

     niveaux.forEach((niveau, i) => {
         const amplitude = Math.max(2, niveau * (hauteur * 0.43));
         contexte.fillStyle = actif ? couleur : '#48505c';
         contexte.globalAlpha = actif ? 0.85 : 0.35;
         contexte.fillRect(
             i * largeurBarre,
             hauteur / 2 - amplitude,
             Math.max(1, largeurBarre * 0.65),
             amplitude * 2
         );
     });

     contexte.globalAlpha = 1;
     contexte.fillStyle = 'rgba(245,248,252,.9)';
     contexte.fillRect(
         Math.max(0, Math.min(largeur - 1, largeur * progression)),
         0,
         Math.max(1, ratio),
         hauteur
     );
 }

 function createPlayer(projet, numero) {
     const section = e('section', 'project');
     section.id = projet.id;

     section.append(e('div', 'project-index', `PROJET ${String(numero + 1).padStart(2, '0')}`));
     section.append(e('h2', '', projet.titre));
     section.append(e('p', 'project-description', projet.description));
     section.append(e('span', 'project-tag', projet.categorie || 'Audio / Vidéo'));

     const box = e('div', 'player');
     box.style.marginTop = '20px';
     const vWrap = e('div', 'video-wrap');
     const video = e('video');
     video.preload = 'metadata';
     video.playsInline = true;
     video.muted = true; // Audio uniquement dans les pistes séparées.
     video.setAttribute('aria-label', `Vidéo : ${projet.titre}`);
     video.src = projet.video;

     const placeholder = e('div', 'media-placeholder');
     placeholder.append(
         e('span', 'play-symbol', '▷'),
         e('strong', '', 'Vidéo à ajouter'),
         e('span', '', 'Ajoute tes fichiers dans le dossier media.')
     );
     vWrap.append(video, placeholder);
     box.append(vWrap);

     const transport = e('div', 'transport');
     const play = e('button', 'play-btn', '▶ Lecture');
     const clock = e('span', 'time', '00:00 / 00:00');
     const seek = e('input', 'seek');
     seek.type = 'range';
     seek.min = '0';
     seek.max = '1000';
     seek.value = '0';
     seek.setAttribute('aria-label', 'Position de lecture');
     transport.append(play, clock, seek);
     box.append(transport);

     const area = e('div', 'track-area');
     const header = e('div', 'track-header');
     header.append(e('p', '', 'PISTES AUDIO SÉPARÉES'));
     const reset = e('button', 'reset-btn', 'Tout réactiver');
     header.append(reset);
     area.append(header);

     const pistes = (projet.pistes || []).map((piste, index) => {
         const line = e('div', 'track');
         const name = e('span', 'track-name', piste.nom);
         const canvas = e('canvas', 'wave');
         const mute = e('button', '', 'M');
         const solo = e('button', '', 'S');
         mute.title = `Muet : ${piste.nom}`;
         solo.title = `Solo : ${piste.nom}`;
         mute.setAttribute('aria-label', `Couper la piste ${piste.nom}`);
         solo.setAttribute('aria-label', `Isoler la piste ${piste.nom}`);
         mute.setAttribute('aria-pressed', 'false');
         solo.setAttribute('aria-pressed', 'false');
         line.append(name, canvas, mute, solo);
         area.append(line);

         const audio = new Audio(piste.fichier);
         audio.preload = 'auto';
         const track = {
             ...piste,
             audio,
             line,
             canvas,
             mute,
             solo,
             isMute: false,
             isSolo: false,
             levels: Array.from(
                 { length: 145 },
                 (_, j) => 0.06 + 0.14 * Math.abs(Math.sin(j * 0.85 + index * 3))
             )
         };

         mute.addEventListener('click', () => {
             track.isMute = !track.isMute;
             updateMix();
         });
         solo.addEventListener('click', () => {
             track.isSolo = !track.isSolo;
             updateMix();
         });
         canvas.addEventListener('click', event => {
             if (!Number.isFinite(video.duration)) return;
             const rectangle = canvas.getBoundingClientRect();
             video.currentTime = Math.max(
                 0,
                 Math.min(video.duration, (event.clientX - rectangle.left) / rectangle.width * video.duration)
             );
             sync(true);
             paint();
         });
         audio.addEventListener('error', () => {
             afficherErreur(`Impossible de charger ${piste.nom} (${piste.fichier}).`);
         });
         return track;
     });

     box.append(area);
     const status = e('div', 'status', 'Charge les fichiers pour écouter les pistes.');
     box.append(status);
     section.append(box);

     function afficherErreur(message) {
         console.error(`[${projet.titre}] ${message}`);
         status.textContent = message;
         status.classList.add('player-error');
     }

     function updateMix() {
         const hasSolo = pistes.some(track => track.isSolo);
         for (const track of pistes) {
             const actif = !track.isMute && (!hasSolo || track.isSolo);
             track.audio.muted = !actif;
             track.audio.volume = actif ? 1 : 0;
             track.mute.classList.toggle('muted', track.isMute);
             track.solo.classList.toggle('solo', track.isSolo);
             track.line.classList.toggle('disabled', !actif);
             track.mute.setAttribute('aria-pressed', String(track.isMute));
             track.solo.setAttribute('aria-pressed', String(track.isSolo));
         }
         paint();
     }

     reset.addEventListener('click', () => {
         pistes.forEach(track => {
             track.isMute = false;
             track.isSolo = false;
         });
         updateMix();
     });

     function sync(force = false) {
         for (const track of pistes) {
             const audio = track.audio;
             if (Number.isFinite(video.currentTime) && Number.isFinite(audio.duration)) {
                 const ecart = Math.abs(audio.currentTime - video.currentTime);
                 if (ecart > (force ? 0.05 : 0.20)) {
                     try {
                         audio.currentTime = Math.min(video.currentTime, audio.duration);
                     } catch (erreur) {
                         console.warn('Synchronisation audio différée', track.nom, erreur);
                     }
                 }
             }
             audio.playbackRate = video.playbackRate;
         }
     }

     function paint() {
         const progression = Number.isFinite(video.duration) && video.duration > 0
             ? video.currentTime / video.duration
             : 0;
         clock.textContent = `${temps(video.currentTime)} / ${temps(video.duration)}`;
         seek.value = Math.round(progression * 1000);
         for (const track of pistes) {
             dessine(
                 track.canvas,
                 track.couleur || '#a9e66b',
                 track.levels,
                 progression,
                 !track.audio.muted
             );
         }
     }

     async function readWaveform(track) {
         try {
             const response = await fetch(track.fichier);
             if (!response.ok) throw new Error(`HTTP ${response.status}`);
             const tampon = await response.arrayBuffer();
             const AudioContextClass = window.AudioContext || window.webkitAudioContext;
             const contexte = new AudioContextClass();
             try {
                 const decoded = await contexte.decodeAudioData(tampon);
                 const samples = decoded.getChannelData(0);
                 const nombre = track.levels.length;
                 const pas = Math.max(1, Math.floor(samples.length / nombre));
                 track.levels = Array.from({ length: nombre }, (_, i) => {
                     let maximum = 0;
                     const debut = i * pas;
                     const increment = Math.max(1, Math.floor(pas / 120));
                     for (let j = debut; j < Math.min(debut + pas, samples.length); j += increment) {
                         maximum = Math.max(maximum, Math.abs(samples[j]));
                     }
                     return Math.min(1, maximum);
                 });
                 paint();
             } finally {
                 await contexte.close();
             }
         } catch (erreur) {
             // Les barres illustratives restent visibles si le décodage échoue.
             console.warn(`Forme d'onde indisponible pour ${track.nom}`, erreur);
         }
     }

     // IMPORTANT : appeler audio.play() directement depuis le clic,
     // sans attendre video.play(), pour respecter les règles des navigateurs.
     function toggle() {
         if (!video.paused) {
             video.pause();
             return;
         }

         for (const instance of instances) {
             if (instance !== api) instance.pause();
         }

         status.classList.remove('player-error');
         status.textContent = 'M : mute · S : solo · Clique sur une forme d’onde pour avancer.';
         sync(true);

         for (const track of pistes) {
             track.audio.play().catch(erreur => {
                 console.error(`Lecture impossible : ${track.nom}`, erreur);
                 afficherErreur(`Audio ${track.nom} : ${erreur.message}`);
             });
         }

         video.play().catch(erreur => {
             pistes.forEach(track => track.audio.pause());
             afficherErreur(`Vidéo : ${erreur.message}`);
         });
     }

     function pause() {
         video.pause();
         pistes.forEach(track => track.audio.pause());
     }

     play.addEventListener('click', toggle);
     video.addEventListener('click', toggle);

     video.addEventListener('play', () => {
         // L'audio a déjà été démarré par le clic ; ne pas le relancer ici.
         sync(true);
         play.textContent = '❚❚ Pause';
     });
     video.addEventListener('pause', () => {
         pistes.forEach(track => track.audio.pause());
         play.textContent = '▶ Lecture';
     });
     video.addEventListener('ended', () => {
         pistes.forEach(track => track.audio.pause());
         play.textContent = '▶ Lecture';
     });
     video.addEventListener('seeking', () => sync(true));
     video.addEventListener('seeked', paint);
     video.addEventListener('timeupdate', () => {
         sync();
         paint();
     });
     video.addEventListener('ratechange', () => sync());
     video.addEventListener('loadedmetadata', () => {
         vWrap.classList.add('has-video');
         status.textContent = 'M : mute · S : solo · Clique sur une forme d’onde pour avancer.';
         paint();
     });
     video.addEventListener('error', () => {
         afficherErreur(`Vidéo introuvable : ${projet.video}`);
     });

     seek.addEventListener('input', () => {
         if (!Number.isFinite(video.duration)) return;
         video.currentTime = video.duration * (Number(seek.value) / 1000);
         sync(true);
         paint();
     });

     if ('ResizeObserver' in window) {
         const observer = new ResizeObserver(paint);
         pistes.forEach(track => observer.observe(track.canvas));
     } else {
         window.addEventListener('resize', paint);
     }

     const api = { pause };
     instances.push(api);
     updateMix();
     pistes.forEach(track => readWaveform(track));
     return section;
 }

 if (nav && conteneur) {
     projets.forEach((projet, index) => {
         const lien = e('a', '', projet.titre);
         lien.href = '#' + projet.id;
         nav.append(lien);
         conteneur.append(createPlayer(projet, index));
     });

     const liens = [...nav.querySelectorAll('a')];
     if ('IntersectionObserver' in window) {
         const observer = new IntersectionObserver(entries => {
             for (const entry of entries) {
                 if (entry.isIntersecting) {
                     liens.forEach(lien => {
                         lien.classList.toggle('active', lien.hash === '#' + entry.target.id);
                     });
                 }
             }
         }, { rootMargin: '-20% 0px -65% 0px' });
         document.querySelectorAll('.project').forEach(section => observer.observe(section));
     }
 }
