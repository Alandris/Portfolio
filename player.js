/*
 * PORTFOLIO SONORE — Lecteur vidéo et pistes audio synchronisées
 *
 * Chaque projet est décrit dans data.js.
 * - pisteBrute : piste originale, en Solo au démarrage
 * - pistes     : pistes nettoyées, sans Mute au démarrage (silencieuses grâce au Solo du brut)
 * - sourceUrl  : lien facultatif vers la vidéo d'origine (YouTube, etc.)
 *
 * Le bouton « Réinitialiser » retrouve exactement cet état de départ.
 * Aucune bibliothèque externe n'est nécessaire.
 */

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
    const sec = String(Math.floor(secondes % 60)).padStart(2, '0');
    return `${minutes}:${sec}`;
}

function dessine(canvas, couleur, niveaux, progression, actif) {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const largeur = Math.max(1, Math.round(rect.width * ratio));
    const hauteur = Math.max(1, Math.round(rect.height * ratio));

    if (canvas.width !== largeur || canvas.height !== hauteur) {
        canvas.width = largeur;
        canvas.height = hauteur;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, largeur, hauteur);
    const largeurBarre = largeur / niveaux.length;

    niveaux.forEach((niveau, i) => {
        const amplitude = Math.max(2, niveau * hauteur * 0.43);
        ctx.fillStyle = actif ? couleur : '#48505c';
        ctx.globalAlpha = actif ? 0.85 : 0.35;
        ctx.fillRect(
            i * largeurBarre,
            hauteur / 2 - amplitude,
            Math.max(1, largeurBarre * 0.65),
            amplitude * 2
        );
    });

    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(245,248,252,.9)';
    const x = Math.max(0, Math.min(largeur - 1, largeur * progression));
    ctx.fillRect(x, 0, Math.max(1, ratio), hauteur);
}

// N'accepte que des liens http/https. Une chaîne vide n'affiche aucun lien.
function adresseSource(valeur) {
    if (typeof valeur !== 'string' || !valeur.trim()) return '';
    try {
        const url = new URL(valeur.trim());
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
        return '';
    }
}

function createPlayer(projet, numero) {
    const section = e('section', 'project');
    section.id = projet.id;

    section.append(e('div', 'project-index', `PROJET ${String(numero + 1).padStart(2, '0')}`));
    section.append(e('h2', '', projet.titre));
    section.append(e('p', 'project-description', projet.description));
    section.append(e('span', 'project-tag', projet.categorie || 'Audio / Vidéo'));

    // Le lien vers la vidéo complète est facultatif et indépendant de l'extrait local.
    const lienOriginal = adresseSource(projet.sourceUrl);
    if (lienOriginal) {
        const lien = e('a', 'project-source', '↗ Voir la vidéo d’origine');
        lien.href = lienOriginal;
        lien.target = '_blank';
        lien.rel = 'noopener noreferrer';
        section.append(lien);
    }

    const box = e('div', 'player');
    box.style.marginTop = '20px';

    const vWrap = e('div', 'video-wrap');
    const video = e('video');
    video.preload = 'metadata';
    video.playsInline = true;
    video.muted = true; // L'audio est joué uniquement par les pistes séparées.
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
    play.type = 'button';
    seek.type = 'range';
    seek.min = '0';
    seek.max = '1000';
    seek.value = '0';
    seek.setAttribute('aria-label', 'Position de lecture');
    transport.append(play, clock, seek);
    box.append(transport);

    const area = e('div', 'track-area');

    // Bouton placé en bas à droite du bloc des pistes.
    const reset = e('button', 'reset-btn', '↺ Réinitialiser');
    reset.type = 'button';
    reset.title = 'Remettre la piste originale en Solo, sans aucune piste en Mute';

    // Le brut est ajouté AU-DESSUS des pistes nettoyées.
    // Si un ancien projet n'a pas encore de pisteBrute, ses pistes sont conservées.
    const definitions = [];
    const brut = projet.pisteBrute;
    if (brut && brut.fichier) {
        definitions.push({ ...brut, groupe: 'brut' });
    }
    for (const piste of (projet.pistes || [])) {
        if (piste && piste.fichier) {
            definitions.push({ ...piste, groupe: 'clean' });
        }
    }

    let pisteBrutePresente = false;
    let pistesCleanPresentes = false;

    const pistes = definitions.map((p, i) => {
        if (p.groupe === 'brut' && !pisteBrutePresente) {
            // Identique à la mise en forme du titre "Pistes nettoyées".
            const separator = e('div', 'track-group-separator track-group-original');
            separator.append(e('span', '', 'PISTE ORIGINALE'));
            area.append(separator);
            pisteBrutePresente = true;
        }
        if (p.groupe === 'clean' && !pistesCleanPresentes) {
            const separator = e('div', 'track-group-separator');
            separator.append(e('span', '', 'PISTES NETTOYÉES'));
            area.append(separator);
            pistesCleanPresentes = true;
        }

        const line = e('div', p.groupe === 'brut' ? 'track track-origin' : 'track track-clean');
        const name = e('span', 'track-name', p.nom);
        const canvas = e('canvas', 'wave');
        const mute = e('button', '', 'M');
        const solo = e('button', '', 'S');
        mute.type = 'button';
        solo.type = 'button';
        mute.title = `Mute : ${p.nom}`;
        solo.title = `Solo : ${p.nom}`;
        mute.setAttribute('aria-label', `Couper la piste ${p.nom}`);
        solo.setAttribute('aria-label', `Écouter en solo la piste ${p.nom}`);
        mute.setAttribute('aria-pressed', 'false');
        solo.setAttribute('aria-pressed', 'false');
        canvas.setAttribute('role', 'button');
        canvas.setAttribute('tabindex', '0');
        canvas.setAttribute('aria-label', `Se déplacer dans la piste ${p.nom}`);
        line.append(name, canvas, mute, solo);
        area.append(line);

        const audio = new Audio(p.fichier);
        audio.preload = 'metadata';
        const track = {
            ...p,
            audio, line, canvas, mute, solo,
            isMute: false,
            isSolo: p.groupe === 'brut',
            levels: Array.from(
                { length: 145 },
                (_, j) => 0.06 + 0.14 * Math.abs(Math.sin(j * 0.85 + i * 3))
            )
        };

        mute.addEventListener('click', () => {
            track.isMute = !track.isMute;
            updateMix();
        });
        solo.addEventListener('click', () => {
            // Au maximum une piste en Solo dans le projet.
            // Cliquer sur le Solo déjà actif le désactive : toutes les pistes
            // deviennent alors audibles (puisqu'aucune n'est en Mute).
            const activerSolo = !track.isSolo;

            for (const piste of pistes) {
                piste.isSolo = activerSolo && piste === track;
                piste.isMute = false; // Un clic sur Solo retire tous les Mute.
            }

            updateMix();
        });

        function deplacer(event) {
            if (!Number.isFinite(video.duration) || video.duration <= 0) return;
            const rect = canvas.getBoundingClientRect();
            if (!rect.width) return;
            const part = (event.clientX - rect.left) / rect.width;
            video.currentTime = Math.max(0, Math.min(video.duration, part * video.duration));
            sync(true);
            paint();
        }
        canvas.addEventListener('click', deplacer);
        canvas.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const rect = canvas.getBoundingClientRect();
                deplacer({ clientX: rect.left + rect.width / 2 });
            }
        });
        return track;
    });

    // Légende concise à gauche, bouton Réinitialiser à droite.
    const footer = e('div', 'track-footer');
    footer.append(e('span', 'track-legend', 'M = Mute, S = Solo'));
    footer.append(reset);
    area.append(footer);

    box.append(area);

    // Aucun texte supplémentaire sous les pistes en situation normale.
    // Un message d'erreur reste disponible uniquement en cas de problème média.
    const status = e('div', 'status player-message');
    status.hidden = true;
    box.append(status);
    section.append(box);

    function erreur(message) {
        console.error(`[${projet.titre}] ${message}`);
        status.textContent = message;
        status.hidden = false;
        status.classList.add('player-error');
    }

    function updateMix() {
        const hasSolo = pistes.some(t => t.isSolo);
        for (const t of pistes) {
            const audible = !t.isMute && (!hasSolo || t.isSolo);
            t.audio.muted = !audible;
            t.audio.volume = audible ? 1 : 0;
            t.mute.classList.toggle('muted', t.isMute);
            t.solo.classList.toggle('solo', t.isSolo);
            t.line.classList.toggle('disabled', !audible);
            t.mute.setAttribute('aria-pressed', String(t.isMute));
            t.solo.setAttribute('aria-pressed', String(t.isSolo));
        }
        paint();
    }

    // L'action Réinitialiser restaure la configuration initiale,
    // contrairement à l'ancien bouton « Tout réactiver ».
    reset.addEventListener('click', () => {
        for (const t of pistes) {
            t.isMute = false;            // Aucun bouton Mute activé.
            t.isSolo = t.groupe === 'brut'; // Seul le son original reste en Solo.
        }
        updateMix();
    });

    function sync(force = false) {
        for (const t of pistes) {
            const audio = t.audio;
            if (Number.isFinite(video.currentTime) && Number.isFinite(audio.duration)) {
                const ecart = Math.abs(audio.currentTime - video.currentTime);
                if (ecart > (force ? 0.05 : 0.16)) {
                    try {
                        audio.currentTime = Math.min(video.currentTime, audio.duration);
                    } catch (ex) {
                        console.warn(`Synchronisation de ${t.nom} différée`, ex);
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
        for (const t of pistes) {
            dessine(t.canvas, t.couleur || '#a9e66b', t.levels, progression, !t.audio.muted);
        }
    }

    // Génère les formes d'onde à partir des vrais fichiers audio.
    async function readWaveform(t) {
        try {
            const response = await fetch(t.fichier);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const buffer = await response.arrayBuffer();
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            const ac = new AudioContextClass();
            try {
                const decoded = await ac.decodeAudioData(buffer);
                const channel = decoded.getChannelData(0);
                const bars = t.levels.length;
                const step = Math.max(1, Math.floor(channel.length / bars));
                t.levels = Array.from({ length: bars }, (_, i) => {
                    let max = 0;
                    const start = i * step;
                    const stride = Math.max(1, Math.floor(step / 120));
                    for (let j = start; j < Math.min(start + step, channel.length); j += stride) {
                        max = Math.max(max, Math.abs(channel[j]));
                    }
                    return Math.min(1, max);
                });
                paint();
            } finally {
                await ac.close();
            }
        } catch (ex) {
            console.warn(`Forme d'onde impossible à charger : ${t.fichier}`, ex);
            // Les barres illustratives restent affichées.
        }
    }

    // Conserve la logique de lecture de la version GitHub qui fonctionne.
    async function toggle() {
        if (!video.paused) {
            video.pause();
            return;
        }
        for (const inst of instances) {
            if (inst !== api) inst.pause();
        }
        sync(true);
        try {
            await video.play();
        } catch (ex) {
            erreur(`Impossible de lire la vidéo : ${ex.message}`);
        }
    }

    function pause() {
        video.pause();
        pistes.forEach(t => t.audio.pause());
    }

    play.addEventListener('click', toggle);
    video.addEventListener('click', toggle);
    video.addEventListener('play', () => {
        sync(true);
        for (const t of pistes) {
            t.audio.play().catch(ex => erreur(`Lecture audio impossible (${t.nom}) : ${ex.message}`));
        }
        play.textContent = '❚❚ Pause';
    });
    video.addEventListener('pause', () => {
        pistes.forEach(t => t.audio.pause());
        play.textContent = '▶ Lecture';
    });
    video.addEventListener('ended', () => {
        pistes.forEach(t => t.audio.pause());
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
        paint();
    });
    video.addEventListener('error', () => {
        erreur(`Vidéo introuvable ou incompatible : ${projet.video}`);
    });
    seek.addEventListener('input', () => {
        if (!Number.isFinite(video.duration)) return;
        video.currentTime = video.duration * (Number(seek.value) / 1000);
        sync(true);
        paint();
    });

    if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(paint);
        pistes.forEach(t => observer.observe(t.canvas));
    } else {
        window.addEventListener('resize', paint);
    }

    const api = { pause };
    instances.push(api);
    updateMix();
    pistes.forEach(t => readWaveform(t));
    return section;
}

if (nav && conteneur) {
    projets.forEach((p, i) => {
        const lien = e('a', '', p.titre);
        lien.href = '#' + p.id;
        nav.append(lien);
        conteneur.append(createPlayer(p, i));
    });

    const anchors = [...nav.querySelectorAll('a')];
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    anchors.forEach(a => a.classList.toggle(
                        'active',
                        a.hash === '#' + entry.target.id
                    ));
                }
            }
        }, { rootMargin: '-20% 0px -65% 0px' });
        document.querySelectorAll('.project').forEach(s => observer.observe(s));
    }
}
