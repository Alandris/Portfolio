// Lecteur de présentation audio/vidéo. Aucun serveur ni bibliothèque externe requis.
const projets = window.PORTFOLIO_PROJECTS || [];
const nav = document.getElementById('project-nav');
const conteneur = document.getElementById('projects');
const instances = [];
function e(tag,cls,text){ const n=document.createElement(tag); if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n; }
function temps(s){if(!Number.isFinite(s))return '00:00';return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;}
function dessine(canvas,color,levels,progres,actif){
 const rect=canvas.getBoundingClientRect(),ratio=window.devicePixelRatio||1;
 const w=Math.max(1,Math.round(rect.width*ratio)),h=Math.max(1,Math.round(rect.height*ratio));
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
 const ctx=canvas.getContext('2d');ctx.clearRect(0,0,w,h);
 const width=w/levels.length;
 levels.forEach((v,i)=>{const amp=Math.max(2,v*(h*.43));ctx.fillStyle=actif?color:'#48505c';ctx.globalAlpha=actif?.85:.35;ctx.fillRect(i*width,h/2-amp,Math.max(1,width*.65),amp*2);});
 ctx.globalAlpha=1;ctx.fillStyle='rgba(245,248,252,.9)';ctx.fillRect(Math.max(0,Math.min(w-1,w*progres)),0,Math.max(1,ratio),h);
}
function createPlayer(projet,num){
 const section=e('section','project');section.id=projet.id;
 const badge=e('div','project-index',`PROJET ${String(num+1).padStart(2,'0')}`);section.append(badge);
 section.append(e('h2','',projet.titre),e('p','project-description',projet.description));
 section.append(e('span','project-tag',projet.categorie||'Audio / Vidéo'));
 const box=e('div','player');box.style.marginTop='20px';
 const vWrap=e('div','video-wrap'),video=e('video');video.preload='metadata';video.playsInline=true;video.muted=true;video.setAttribute('aria-label',`Vidéo : ${projet.titre}`);video.src=projet.video;
 const placeholder=e('div','media-placeholder');placeholder.append(e('span','play-symbol','▷'),e('strong','', 'Vidéo à ajouter'),e('span','', 'Ajoute tes fichiers dans le dossier media.'));
 vWrap.append(video,placeholder);box.append(vWrap);
 const transport=e('div','transport'),play=e('button','play-btn','▶ Lecture'),clock=e('span','time','00:00 / 00:00'),seek=e('input','seek');seek.type='range';seek.min='0';seek.max='1000';seek.value='0';seek.setAttribute('aria-label','Position de lecture');
 transport.append(play,clock,seek);box.append(transport);
 const area=e('div','track-area'),header=e('div','track-header');header.append(e('p','','PISTES AUDIO SÉPARÉES'));
 const reset=e('button','reset-btn','Tout réactiver');header.append(reset);area.append(header);
 const pistes=(projet.pistes||[]).map((p,i)=>{
  const line=e('div','track'),name=e('span','track-name',p.nom),canvas=e('canvas','wave'),mute=e('button','','M'),solo=e('button','','S');
  mute.title=`Muet : ${p.nom}`;solo.title=`Solo : ${p.nom}`;mute.setAttribute('aria-label',`Couper la piste ${p.nom}`);solo.setAttribute('aria-label',`Isoler la piste ${p.nom}`);mute.setAttribute('aria-pressed','false');solo.setAttribute('aria-pressed','false');
  line.append(name,canvas,mute,solo);area.append(line);
  const audio=new Audio(p.fichier);audio.preload='metadata';
  const track={...p,audio,line,canvas,mute,solo,isMute:false,isSolo:false,levels:Array.from({length:145},(_,j)=>.06+.14*Math.abs(Math.sin(j*.85+i*3)))};
  mute.addEventListener('click',()=>{track.isMute=!track.isMute;updateMix();});
  solo.addEventListener('click',()=>{track.isSolo=!track.isSolo;updateMix();});
  canvas.addEventListener('click',ev=>{if(!Number.isFinite(video.duration))return;const r=canvas.getBoundingClientRect();video.currentTime=Math.max(0,Math.min(video.duration,(ev.clientX-r.left)/r.width*video.duration));sync(true);});
  return track;
 });
 box.append(area);const status=e('div','status','Ajoute une vidéo et ses trois pistes pour activer la lecture.');box.append(status);section.append(box);
 function updateMix(){const hasSolo=pistes.some(t=>t.isSolo);for(const t of pistes){const on=!t.isMute&&(!hasSolo||t.isSolo);t.audio.muted=!on;t.audio.volume=on?1:0;t.mute.classList.toggle('muted',t.isMute);t.solo.classList.toggle('solo',t.isSolo);t.line.classList.toggle('disabled',!on);t.mute.setAttribute('aria-pressed',String(t.isMute));t.solo.setAttribute('aria-pressed',String(t.isSolo));}paint();}
 reset.addEventListener('click',()=>{pistes.forEach(t=>{t.isMute=false;t.isSolo=false});updateMix();});
 function sync(force=false){for(const t of pistes){if(Number.isFinite(video.currentTime)&&Number.isFinite(t.audio.duration)&&Math.abs(t.audio.currentTime-video.currentTime)>(force?.05:.16)){try{t.audio.currentTime=Math.min(video.currentTime,t.audio.duration)}catch{}}t.audio.playbackRate=video.playbackRate;}}
 function paint(){const progress=Number.isFinite(video.duration)&&video.duration>0?video.currentTime/video.duration:0;clock.textContent=`${temps(video.currentTime)} / ${temps(video.duration)}`;seek.value=Math.round(progress*1000);for(const t of pistes)dessine(t.canvas,t.couleur||'#a9e66b',t.levels,progress,!t.audio.muted);}
 async function readWaveform(t){try{const response=await fetch(t.fichier);if(!response.ok)throw Error();const buf=await response.arrayBuffer();const ac=new (window.AudioContext||window.webkitAudioContext)();try{const decoded=await ac.decodeAudioData(buf);const ch=decoded.getChannelData(0);const bars=t.levels.length,step=Math.max(1,Math.floor(ch.length/bars));t.levels=Array.from({length:bars},(_,i)=>{let m=0;const start=i*step;for(let j=start;j<Math.min(start+step,ch.length);j+=Math.max(1,Math.floor(step/120)))m=Math.max(m,Math.abs(ch[j]));return Math.min(1,m)});paint();}finally{await ac.close();}}catch{ /* Onde illustrative si le fichier n'est pas encore disponible. */ }}
 async function toggle(){if(!video.paused){video.pause();return;}for(const inst of instances){if(inst!==api)inst.pause();}sync(true);try{await video.play();}catch{status.textContent='Impossible de lire la vidéo : vérifie que le fichier existe et est compatible.';}}
 function pause(){video.pause();}
 play.addEventListener('click',toggle);
 video.addEventListener('click',toggle);
 video.addEventListener('play',()=>{sync(true);for(const t of pistes){t.audio.play().catch(()=>{});}play.textContent='❚❚ Pause';});
 video.addEventListener('pause',()=>{pistes.forEach(t=>t.audio.pause());play.textContent='▶ Lecture';});
 video.addEventListener('ended',()=>{pistes.forEach(t=>t.audio.pause());play.textContent='▶ Lecture';});
 video.addEventListener('seeking',()=>sync(true));video.addEventListener('seeked',paint);
 video.addEventListener('timeupdate',()=>{sync();paint();});video.addEventListener('ratechange',()=>sync());
 video.addEventListener('loadedmetadata',()=>{vWrap.classList.add('has-video');status.textContent='M : mute · S : solo · Clique sur une forme d’onde pour avancer dans la vidéo.';paint();});
 video.addEventListener('error',()=>{status.textContent='Vidéo introuvable : ajoute le fichier indiqué dans data.js.';status.classList.add('player-error');});
 seek.addEventListener('input',()=>{if(!Number.isFinite(video.duration))return;video.currentTime=video.duration*(Number(seek.value)/1000);sync(true);paint();});
 const observer=new ResizeObserver(paint);pistes.forEach(t=>observer.observe(t.canvas));
 paint();updateMix();const api={pause};instances.push(api);
 // Le décodage audio crée les vraies formes d'onde une fois les fichiers ajoutés.
 pistes.forEach(t=>readWaveform(t));
 return section;
}
projets.forEach((p,i)=>{const a=e('a','',p.titre);a.href='#'+p.id;nav.append(a);conteneur.append(createPlayer(p,i));});
const anchors=[...nav.querySelectorAll('a')];
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){anchors.forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));}}},{rootMargin:'-20% 0px -65% 0px'});document.querySelectorAll('.project').forEach(s=>observer.observe(s));}
