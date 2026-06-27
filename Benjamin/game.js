// ════════════════════════════════════════════
//  SLIME SAGA  –  game.js
//  Sprites cargados desde sprites.js (base64)
//  Fondo blanco eliminado con flood-fill
// ════════════════════════════════════════════

// ── Constantes ──
const COLS    = 17;
const ROWS    = 13;
const CELL    = 40;
const T       = { EMPTY:0, WALL:1, ICE_PINK:2, ICE_BLUE:3, FRUIT:4, ICE_GREEN:5, ICE_SOFIA:6, ICE_GBENJA:7 };
const DX      = [0, 0, -1, 1];
const DY      = [-1, 1, 0, 0];
const DIR     = { UP:0, DOWN:1, LEFT:2, RIGHT:3 };

const CHAR_SKINS = {
  javiera: ['normal', 'candy', 'sun', 'pirate'],
  paloma: ['normal', 'moon', 'sea'],
  sofia: ['normal', 'fox', 'kraken'],
  gbenja: ['normal', 'meteor']
};
const FRUITS  = ['🍒','🍇','🍓','🍊','🍋','🍑','🍎','🍌'];
const P_DELAY = 145;

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
canvas.width  = COLS * CELL;
canvas.height = ROWS * CELL;

// ════════════════════════════════════════════
//  CARGA Y PREPROCESADO DE SPRITES
// ════════════════════════════════════════════

// IMG almacenará HTMLImageElement
const IMG          = {};
let   spritesReady = false;
let   loadedCount  = 0;
const totalSprites = 20;

const SPRITE_KEYS = [
  'javiera_down','javiera_up','javiera_right','javiera_left',
  'paloma_down', 'paloma_up', 'paloma_right', 'paloma_left',
  'benja_down',  'benja_up',  'benja_right',  'benja_left',
  'bot1_down',   'bot1_up',   'bot1_right',   'bot1_left',
  'bot2_down',   'bot2_up',   'bot2_right',   'bot2_left',
  'body',        'body2',     'body3',     'face',      'furious',
  'sword1',      'sword2',    'pause_secret',
  'javiera_candy_down','javiera_candy_up','javiera_candy_right','javiera_candy_left','javiera_candy_ice',
  'javiera_sun_down','javiera_sun_up','javiera_sun_right','javiera_sun_left','javiera_sun_ice',
  'javiera_pirate_down','javiera_pirate_up','javiera_pirate_right','javiera_pirate_left','javiera_pirate_ice',
  'paloma_moon_down','paloma_moon_up','paloma_moon_right','paloma_moon_left','paloma_moon_ice',
  'paloma_sea_down','paloma_sea_up','paloma_sea_right','paloma_sea_left','paloma_sea_ice',
  'sofia_down','sofia_up','sofia_right','sofia_left','sofia_ice',
  'sofia_fox_down','sofia_fox_up','sofia_fox_right','sofia_fox_left','sofia_fox_ice',
  'sofia_kraken_down','sofia_kraken_up','sofia_kraken_right','sofia_kraken_left','sofia_kraken_ice',
  'gbenja_down','gbenja_up','gbenja_right','gbenja_left','gbenja_ice',
  'gbenja_meteor_down','gbenja_meteor_up','gbenja_meteor_right','gbenja_meteor_left','gbenja_meteor_ice',
  'reno_derecha','reno_izquierda'
];

// ── Cargar todos los sprites ──
function loadAllSprites(onDone) {
  const paths = {
    javiera_down:  'Assets/Sprit_Javiera/Javiera.png',
    javiera_up:    'Assets/Sprit_Javiera/Javiera_atras.png',
    javiera_right: 'Assets/Sprit_Javiera/Javiera_derecha.png',
    javiera_left:  'Assets/Sprit_Javiera/Javiera_izquierda.png',
    javiera_candy_down:  'Assets/Sprit_Javiera/Skin-Javiera/Sprit_Candy/Candy.png',
    javiera_candy_up:    'Assets/Sprit_Javiera/Skin-Javiera/Sprit_Candy/Candy-atras.png',
    javiera_candy_right: 'Assets/Sprit_Javiera/Skin-Javiera/Sprit_Candy/Candy-derecha.png',
    javiera_candy_left:  'Assets/Sprit_Javiera/Skin-Javiera/Sprit_Candy/Candy-izquierda.png',
    javiera_candy_ice:   'Assets/Sprit_Javiera/Skin-Javiera/Sprit_Candy/Ice-Candy.png',
    javiera_sun_down:    'Assets/Sprit_Javiera/Skin-Javiera/Sprit_Sun/Sun.png',
    javiera_sun_up:      'Assets/Sprit_Javiera/Skin-Javiera/Sprit_Sun/Sun-atras.png',
    javiera_sun_right:   'Assets/Sprit_Javiera/Skin-Javiera/Sprit_Sun/Sun-derecha.png',
    javiera_sun_left:    'Assets/Sprit_Javiera/Skin-Javiera/Sprit_Sun/Sun-izquierda.png',
    javiera_sun_ice:     'Assets/Sprit_Javiera/Skin-Javiera/Sprit_Sun/Ice-Sun.png',
    javiera_pirate_down:  'Assets/Sprit_Javiera/Skin-Javiera/Sprite_Pirate/Pirate.png',
    javiera_pirate_up:    'Assets/Sprit_Javiera/Skin-Javiera/Sprite_Pirate/Pirate-atras.png',
    javiera_pirate_right: 'Assets/Sprit_Javiera/Skin-Javiera/Sprite_Pirate/Pirate-derecha.png',
    javiera_pirate_left:  'Assets/Sprit_Javiera/Skin-Javiera/Sprite_Pirate/Pirate-izquierda.png',
    javiera_pirate_ice:   'Assets/Sprit_Javiera/Skin-Javiera/Sprite_Pirate/Ice-Pirate.png',
    
    paloma_down:   'Assets/Sprit_Paloma/Paloma.png',
    paloma_up:     'Assets/Sprit_Paloma/Paloma_atras.png',
    paloma_right:  'Assets/Sprit_Paloma/Paloma_derecha.png',
    paloma_left:   'Assets/Sprit_Paloma/Paloma_izquierda.png',
    paloma_moon_down:  'Assets/Sprit_Paloma/Skin-Paloma/Sprit_Moon/Moon.png',
    paloma_moon_up:    'Assets/Sprit_Paloma/Skin-Paloma/Sprit_Moon/Moon-atras.png',
    paloma_moon_right: 'Assets/Sprit_Paloma/Skin-Paloma/Sprit_Moon/Moon-derecha.png',
    paloma_moon_left:  'Assets/Sprit_Paloma/Skin-Paloma/Sprit_Moon/Moon-izquierda.png',
    paloma_moon_ice:   'Assets/Sprit_Paloma/Skin-Paloma/Sprit_Moon/Ice-Moon.png',
    paloma_sea_down:   'Assets/Sprit_Paloma/Skin-Paloma/Sprit_Sea/Sea.png',
    paloma_sea_up:     'Assets/Sprit_Paloma/Skin-Paloma/Sprit_Sea/Sea-atras.png',
    paloma_sea_right:  'Assets/Sprit_Paloma/Skin-Paloma/Sprit_Sea/Sea-derecha.png',
    paloma_sea_left:   'Assets/Sprit_Paloma/Skin-Paloma/Sprit_Sea/Sea-izquierda.png',
    paloma_sea_ice:    'Assets/Sprit_Paloma/Skin-Paloma/Sprit_Sea/Ice-Sea.png',

    sofia_down:    'Assets/Sprit_Sofia/Sofia.png',
    sofia_up:      'Assets/Sprit_Sofia/Sofia-atras.png',
    sofia_right:   'Assets/Sprit_Sofia/Sofia-derecha.png',
    sofia_left:    'Assets/Sprit_Sofia/Sofia-izquierda.png',
    sofia_ice:     'Assets/Sprit_Sofia/Ice-Sofia.png',
    sofia_fox_down:  'Assets/Sprit_Sofia/Skin-Sofia/Sprit_Fox/Fox.png',
    sofia_fox_up:    'Assets/Sprit_Sofia/Skin-Sofia/Sprit_Fox/Fox-atras.png',
    sofia_fox_right: 'Assets/Sprit_Sofia/Skin-Sofia/Sprit_Fox/Fox-derecha.png',
    sofia_fox_left:  'Assets/Sprit_Sofia/Skin-Sofia/Sprit_Fox/Fox-izquierda.png',
    sofia_fox_ice:   'Assets/Sprit_Sofia/Skin-Sofia/Sprit_Fox/Ice-Fox.png',
    sofia_kraken_down:  'Assets/Sprit_Sofia/Skin-Sofia/Sprit_Kraken/Kraken.png',
    sofia_kraken_up:    'Assets/Sprit_Sofia/Skin-Sofia/Sprit_Kraken/Kraken-atras.png',
    sofia_kraken_right: 'Assets/Sprit_Sofia/Skin-Sofia/Sprit_Kraken/Kraken-derecha.png',
    sofia_kraken_left:  'Assets/Sprit_Sofia/Skin-Sofia/Sprit_Kraken/Kraken-izquierda.png',
    sofia_kraken_ice:   'Assets/Sprit_Sofia/Skin-Sofia/Sprit_Kraken/Ice-Kraken.png',

    gbenja_down:   'Assets/Sprite_Gbenja/Gbenja.png',
    gbenja_up:     'Assets/Sprite_Gbenja/Gbenja-atras.png',
    gbenja_right:  'Assets/Sprite_Gbenja/Gbenja-derecha.png',
    gbenja_left:   'Assets/Sprite_Gbenja/Gbenja-izquierda.png',
    gbenja_ice:    'Assets/Sprite_Gbenja/Ice-Gbenja.png',
    gbenja_meteor_down:  'Assets/Sprite_Gbenja/Skin-Gbenja/Sprit_Meteor/Meteor.png',
    gbenja_meteor_up:    'Assets/Sprite_Gbenja/Skin-Gbenja/Sprit_Meteor/Meteor-atras.png',
    gbenja_meteor_right: 'Assets/Sprite_Gbenja/Skin-Gbenja/Sprit_Meteor/Meteor-derecha.png',
    gbenja_meteor_left:  'Assets/Sprite_Gbenja/Skin-Gbenja/Sprit_Meteor/Meteor-izquierda.png',
    gbenja_meteor_ice:   'Assets/Sprite_Gbenja/Skin-Gbenja/Sprit_Meteor/Ice-Meteor.png',
    benja_down:    'Assets/Sprit_Benja/Benja.png',
    benja_up:      'Assets/Sprit_Benja/Benja_atras.png',
    benja_right:   'Assets/Sprit_Benja/Benja_derecha.png',
    benja_left:    'Assets/Sprit_Benja/Benja_izquierda.png',
    bot1_down:     'Assets/Sprit_bot/bot1.png',
    bot1_up:       'Assets/Sprit_bot/bot1_atras.png',
    bot1_right:    'Assets/Sprit_bot/bot1_derecha.png',
    bot1_left:     'Assets/Sprit_bot/bot1_izquierda.png',
    bot2_down:     'Assets/Sprit_bot2/bot2.png',
    bot2_up:       'Assets/Sprit_bot2/bot2_atras.png',
    bot2_right:    'Assets/Sprit_bot2/bot2_derecha.png',
    bot2_left:     'Assets/Sprit_bot2/bot2_izquierda.png',
    body:          'Assets/zecret/body.png',
    body2:         'Assets/zecret/body2.png',
    body3:         'Assets/zecret/body3.png',
    face:          'Assets/zecret/face.png',
    furious:       'Assets/zecret/furious.png',
    sword1:        'Assets/zecret/sword1.png',
    sword2:        'Assets/zecret/sword2.png',
    pause_secret:  'Assets/pause-secret.png',
    reno_derecha:  'Assets/Reno-derecha.png',
    reno_izquierda:'Assets/Reno-izquierda.png'
  };
  let done = 0;
  SPRITE_KEYS.forEach(k => {
    const img = new Image();
    img.onload = img.onerror = () => { IMG[k] = img; if (++done === SPRITE_KEYS.length) { spritesReady=true; onDone(); } };
    img.src = paths[k] || '';
  });
}

// ════════════════════════════════════════════
//  CONFIGURACIÓN DE ENEMIGOS
// ════════════════════════════════════════════
const ENEMY_CFG = {
  1: { key:'bot1',  delay:500, fireInterval:0,    breaksBlocks:false },
  2: { key:'bot2',  delay:320, fireInterval:3500,  breaksBlocks:false },
  3: { key:'benja', delay:190, fireInterval:2200,  breaksBlocks:true  },
};

const FALLBACK_COL = {
  javiera:'#ff7ecb', paloma:'#5bc8ff',
  bot1:'#8ed6c8',    bot2:'#ff9f1c', benja:'#a030f0',
};

// ════════════════════════════════════════════
//  ESTADO DEL JUEGO
// ════════════════════════════════════════════
function makePlayer(x, y, charName) {
  return { x, y, dir:DIR.DOWN, char:charName,
           lives:3, active:true, pTimer:0,
           invincible:false, invTimer:0, startX:x, startY:y };
}

let cheatBuffer = "";
const bgMusicZ = new Audio('Assets/zmusic.mpeg');
bgMusicZ.loop = true;
bgMusicZ.volume = 0.5; // Volumen reducido a la mitad

const bgMusicReno = new Audio('Assets/music-reno.mp3');
bgMusicReno.loop = true;
bgMusicReno.volume = 0.5;

function stopZMusic() { 
  bgMusicZ.pause(); bgMusicZ.currentTime = 0; 
  bgMusicReno.pause(); bgMusicReno.currentTime = 0;
}

const eatSound = new Audio('Assets/comer.mpeg');
eatSound.volume = 0.3;

const G = {
  mode:'1p', level:1, bossPhase:0, bossHp:12,
  grid:[], fruitMap:{},
  p1:null, p2:null, enemy:null, reno:null,
  scoreP1:0, scoreP2:0,
  fireballs:[], fireTimer:0, fireInterval:0,
  running:false, raf:null, lastT:0, paused:false,
  eTimer:0, eDelay:480,
  fKeyDown:false, spaceDown:false,
  bossState:'moving', bossChargeT:0, bossAttackT:10000, bossAttackType:0, bossTarget:{x:0,y:0}, bossSwordAngle:0,
  skins:{javiera:0, paloma:0, sofia:0, gbenja:0},
  grabbedMarker: null, p1Char: 'javiera', p2Char: 'paloma'
};

// ── Input ──
const KEYS  = {};
const MKEYS = {};
const MKEYS2 = {};

document.addEventListener('keydown', e => {
  if (e.key && e.key.length === 1) {
    cheatBuffer += e.key.toLowerCase();
    if (cheatBuffer.length > 10) cheatBuffer = cheatBuffer.slice(-10);
    
    if (cheatBuffer.endsWith("nivel 4") || cheatBuffer.endsWith("nivel4")) {
      G.running = false;
      cancelAnimationFrame(G.raf);
      stopZMusic();
      if (typeof showOv === 'function') showOv(null);
      if (typeof showScreen === 'function') showScreen('gameScreen');
      announceLevel('Nivel 4', () => { 
        initLevel(4, false); 
        G.lastT = performance.now(); 
        loop(G.lastT); 
      });
    }

    if (G.level !== 'secret') {
      const triggerSeq = (spriteType) => {
        G.running = false;
        cancelAnimationFrame(G.raf);
        stopZMusic();
        if (typeof showOv === 'function') showOv(null);
        playCinematic('Assets/secreto.mp4', () => {
          if (typeof showScreen === 'function') showScreen('gameScreen');
          triggerSecretLevel(spriteType);
        });
      };
      
      if (cheatBuffer.endsWith("adolfo")) {
        if (window.adolfTimeout) { clearTimeout(window.adolfTimeout); window.adolfTimeout = null; }
        triggerSeq('body2');
      } else if (cheatBuffer.endsWith("adolf")) {
        if (!window.adolfTimeout) {
          window.adolfTimeout = setTimeout(() => {
            if (G.level !== 'secret') triggerSeq('body');
            window.adolfTimeout = null;
          }, 400);
        }
      }
    }
  }
  KEYS[e.code] = true;
  if ((e.code === 'Digit0' || e.code === 'Numpad0') && G.level === 'secret') {
    togglePauseSecret();
  }
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'KeyF' && !G.fKeyDown)   { G.fKeyDown=true;  doIce(G.p1); }
  if (e.code === 'Space' && !G.spaceDown) {
    G.spaceDown = true;
    if (G.mode==='2p' && G.p2 && G.p2.active) doIce(G.p2);
    else doIce(G.p1);
  }
});
document.addEventListener('keyup', e => {
  KEYS[e.code] = false;
  if (e.code==='KeyF')  G.fKeyDown  = false;
  if (e.code==='Space') G.spaceDown = false;
});

function togglePauseSecret() {
  if (G.level !== 'secret') return;
  G.paused = !G.paused;
  let pauseEl = document.getElementById('ovPauseSecret');
  if (!pauseEl) {
    pauseEl = document.createElement('div');
    pauseEl.id = 'ovPauseSecret';
    pauseEl.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;display:none;background-color:black;background-image:url("Assets/pause-secret.png");background-size:100% 100%;background-position:center;';
    document.body.appendChild(pauseEl);
  }
  pauseEl.style.display = G.paused ? 'block' : 'none';
  if (G.paused) { 
    bgMusicZ.pause(); 
    bgMusicReno.pause();
  } else { 
    if (G.level === 'reno') bgMusicReno.play();
    else bgMusicZ.play(); 
  }
}

function getDirP1() {
  if (KEYS['KeyW']||MKEYS['up'])    return DIR.UP;
  if (KEYS['KeyS']||MKEYS['down'])  return DIR.DOWN;
  if (KEYS['KeyA']||MKEYS['left'])  return DIR.LEFT;
  if (KEYS['KeyD']||MKEYS['right']) return DIR.RIGHT;
  if (G.mode==='1p') {
    if (KEYS['ArrowUp'])    return DIR.UP;
    if (KEYS['ArrowDown'])  return DIR.DOWN;
    if (KEYS['ArrowLeft'])  return DIR.LEFT;
    if (KEYS['ArrowRight']) return DIR.RIGHT;
  }
  return -1;
}
function getDirP2() {
  if (KEYS['ArrowUp']    || MKEYS2['up'])    return DIR.UP;
  if (KEYS['ArrowDown']  || MKEYS2['down'])  return DIR.DOWN;
  if (KEYS['ArrowLeft']  || MKEYS2['left'])  return DIR.LEFT;
  if (KEYS['ArrowRight'] || MKEYS2['right']) return DIR.RIGHT;
  return -1;
}

function mkP(d,el){ MKEYS[d]=true;  el.classList.add('pressed'); }
function mkR(d,el){ MKEYS[d]=false; el.classList.remove('pressed'); }
function doIceP1(){ doIce(G.p1); }

function mkP2(d,el){ MKEYS2[d]=true;  el.classList.add('pressed'); }
function mkR2(d,el){ MKEYS2[d]=false; el.classList.remove('pressed'); }
function doIceP2(){ doIce(G.p2); }

let mobKonamiSeq = ['up','down','up','down','left','right','left','right','ice'];
let mobKonamiIdx = 0;
function mobKonami(key) {
  if (G.level === 'secret') return;
  if (key === mobKonamiSeq[mobKonamiIdx]) {
    mobKonamiIdx++;
    if (mobKonamiIdx === mobKonamiSeq.length) {
      mobKonamiIdx = 0;
      if (G.level !== 'secret') {
        G.running = false;
        cancelAnimationFrame(G.raf);
        stopZMusic();
        if (typeof showOv === 'function') showOv(null);
        playCinematic('Assets/secreto.mp4', () => {
          if (typeof showScreen === 'function') showScreen('gameScreen');
          triggerSecretLevel('body2');
        });
      }
    }
  } else {
    mobKonamiIdx = (key === mobKonamiSeq[0]) ? 1 : 0;
  }
}

// ════════════════════════════════════════════
//  MENÚ — MODO Y PERSONAJE
// ════════════════════════════════════════════
window.toggleSkin = function(e, char) {
  if (e) e.stopPropagation();
  const arr = CHAR_SKINS[char];
  G.skins[char] = (G.skins[char] + 1) % arr.length;
  const activeSkin = arr[G.skins[char]];
  
  const imgPreview = document.querySelector(`#card${char.charAt(0).toUpperCase() + char.slice(1)} .char-preview`);
  
  if (activeSkin === 'normal') {
    imgPreview.src = `Assets/Sprit_${char.charAt(0).toUpperCase() + char.slice(1)}/${char.charAt(0).toUpperCase() + char.slice(1)}.png`;
    // Patch for gbenja
    if (char === 'gbenja') imgPreview.src = `Assets/Sprite_Gbenja/Gbenja.png`;
  } else {
    let subDir = `Skin-${char.charAt(0).toUpperCase() + char.slice(1)}/Sprit_${activeSkin.charAt(0).toUpperCase() + activeSkin.slice(1)}`;
    if (activeSkin === 'pirate') subDir = `Skin-Javiera/Sprite_Pirate`; 
    const prefix = activeSkin.charAt(0).toUpperCase() + activeSkin.slice(1);
    
    let baseDir = `Assets/Sprit_${char.charAt(0).toUpperCase() + char.slice(1)}`;
    if (char === 'gbenja') baseDir = `Assets/Sprite_Gbenja`;
    
    imgPreview.src = `${baseDir}/${subDir}/${prefix}.png`;
  }
}

function setMode(m) {
  G.mode = m;
  document.getElementById('btn1p').classList.toggle('active', m==='1p');
  document.getElementById('btn2p').classList.toggle('active', m==='2p');
  document.getElementById('ctrlP2').style.display     = m==='2p' ? '' : 'none';
  document.getElementById('charSelectLbl').textContent = m==='2p' ? 'Jugador 1 elige su personaje' : 'Elige tu personaje';
  document.getElementById('ctrlP1').textContent        = m==='2p'
    ? 'J1: WASD + F — Mover y lanzar gelatina'
    : 'Flechas / WASD — Mover  |  Espacio / F — Lanzar gelatina';
  document.getElementById('hudP2').style.display      = m==='2p' ? '' : 'none';
  if (document.getElementById('mobCtrl1P')) document.getElementById('mobCtrl1P').style.display = m==='1p' ? 'flex' : 'none';
  if (document.getElementById('mobCtrl2P')) document.getElementById('mobCtrl2P').style.display = m==='2p' ? 'flex' : 'none';
  
  selectChar(G.p1Char);
}

const charsList = ['javiera', 'paloma', 'sofia', 'gbenja'];

function selectChar(c) {
  const is2p = G.mode === '2p';

  let heldMarker = null;
  if (G.p1Char === c) heldMarker = 'J1';
  else if (G.p2Char === c && is2p) heldMarker = 'J2';

  if (G.grabbedMarker) {
    if (G.grabbedMarkerChar === c) {
      G.grabbedMarker = null;
      G.grabbedMarkerChar = null;
    } else {
      if (G.grabbedMarker === 'J1') {
        G.p1Char = c;
        if (G.p1Char === G.p2Char) G.p2Char = G.grabbedMarkerChar;
      } else {
        G.p2Char = c;
        if (G.p2Char === G.p1Char) G.p1Char = G.grabbedMarkerChar;
      }
      G.grabbedMarker = null;
      G.grabbedMarkerChar = null;
    }
  } else {
    if (heldMarker) {
      G.grabbedMarker = heldMarker;
      G.grabbedMarkerChar = c;
    } else {
      G.grabbedMarker = 'J1';
      G.grabbedMarkerChar = G.p1Char;
      G.p1Char = c;
      if (G.p1Char === G.p2Char) G.p2Char = G.grabbedMarkerChar;
      G.grabbedMarker = null;
      G.grabbedMarkerChar = null;
    }
  }

  charsList.forEach(char => {
    const card = document.getElementById(`card${char.charAt(0).toUpperCase() + char.slice(1)}`);
    const tag = document.getElementById(`tag${char.charAt(0).toUpperCase() + char.slice(1)}`);
    card.classList.remove('selected');
    tag.style.opacity = '0';
    tag.style.boxShadow = 'none';

    if (char === G.p1Char) {
      card.classList.add('selected');
      tag.textContent = 'J1';
      tag.style.opacity = '1';
      if (G.grabbedMarker === 'J1' && G.grabbedMarkerChar === char) {
        tag.style.boxShadow = '0 0 10px 4px white';
      }
    } else if (char === G.p2Char && is2p) {
      card.classList.add('selected');
      tag.textContent = 'J2';
      tag.style.opacity = '1';
      if (G.grabbedMarker === 'J2' && G.grabbedMarkerChar === char) {
        tag.style.boxShadow = '0 0 10px 4px white';
      }
    }
  });

  const btn = document.getElementById('mobIceBtn');
  if (btn) btn.className = 'mb mb-ice '+(G.p1Char==='javiera'?'mb-ice-j':'mb-ice-p');
  refreshP2Preview();
}

function refreshP2Preview() {
  // P2 preview was removed from UI
}

// ════════════════════════════════════════════
//  MAPA
// ════════════════════════════════════════════
function buildGrid(lvl) {
  const g = [];
  for (let y=0;y<ROWS;y++) g.push(new Array(COLS).fill(T.EMPTY));
  for (let x=0;x<COLS;x++){ g[0][x]=T.WALL; g[ROWS-1][x]=T.WALL; }
  for (let y=0;y<ROWS;y++){ g[y][0]=T.WALL; g[y][COLS-1]=T.WALL; }
  if (lvl !== 4) {
    for (let y=2;y<ROWS-1;y+=2) for (let x=2;x<COLS-1;x+=2) g[y][x]=T.WALL;
  }
  let myIce = T.ICE_PINK;
  if(G.p1Char==='paloma') myIce = T.ICE_BLUE;
  if(G.p1Char==='sofia') myIce = T.ICE_SOFIA;
  if(G.p1Char==='gbenja') myIce = T.ICE_GBENJA;
  if (lvl>=2 && lvl !== 4) [[5,4],[6,4],[5,8],[6,8],[10,4],[11,4],[10,8],[11,8]].forEach(([x,y])=>{ if(g[y][x]===T.EMPTY) g[y][x]=myIce; });
  if (lvl>=3 && lvl !== 4) [[8,3],[8,4],[8,5],[8,7],[8,8],[8,9],[3,6],[5,6],[11,6],[13,6]].forEach(([x,y])=>{ if(g[y][x]===T.EMPTY) g[y][x]=myIce; });
  return g;
}

function placeFruits(grid, lvl) {
  const count=10+(lvl-1)*3; const fm={}; let placed=0,tries=0;
  while(placed<count&&tries<800){
    tries++;
    const x=1+(0|Math.random()*(COLS-2)), y=1+(0|Math.random()*(ROWS-2));
    if(grid[y][x]!==T.EMPTY) continue;
    if(x<=2&&y<=2) continue; if(x>=COLS-3&&y<=2) continue;
    if(x<=2&&y>=ROWS-3) continue; if(x>=COLS-3&&y>=ROWS-3) continue;
    grid[y][x]=T.FRUIT; fm[y*COLS+x]=FRUITS[0|Math.random()*FRUITS.length]; placed++;
  }
  return fm;
}

function initLevel(lvl, keepLives) {
  document.body.style.backgroundImage = ""; // Restaurar fondo normal
  const cvs = document.getElementById('gameCanvas');
  cvs.style.transition = 'none';
  cvs.style.opacity = '1';
  let hint = document.getElementById('pauseHintTxt');
  if (hint) hint.style.display = 'none';
  
  G.level=lvl; G.bossPhase=0; G.grid=buildGrid(lvl); G.fruitMap=placeFruits(G.grid,lvl);
  const p1c=G.p1Char, p2c=G.p2Char;
  if (!keepLives) {
    G.p1=makePlayer(1,1,p1c);
    G.p2=G.mode==='2p' ? makePlayer(COLS-2,1,p2c) : null;
    G.scoreP1 = 0;
    G.scoreP2 = 0;
  } else {
    const resetPl=(pl,sx,sy)=>{ pl.x=sx;pl.y=sy;pl.dir=DIR.DOWN;pl.startX=sx;pl.startY=sy;pl.pTimer=0;pl.invincible=false;pl.invTimer=0;if(pl.lives>0)pl.active=true; };
    resetPl(G.p1,1,1);
    if(G.mode==='2p'&&G.p2) resetPl(G.p2,COLS-2,1);
  }
  
  if (lvl === 'reno') {
    G.reno = { x: COLS/2|0, y: ROWS/2|0, dir: DIR.RIGHT, moveTimer: 0 };
    G.enemy = null;
    document.getElementById('hudFruits').style.display = 'none';
    document.getElementById('hudScore').style.display = 'block';
  } else if (lvl === 4) {
    G.reno = null;
    G.enemy = null; // Reemplazado por G.bots
    document.getElementById('hudFruits').style.display = 'flex';
    document.getElementById('hudScore').style.display = 'none';
    
    // DVD Boss overlay
    const bossEl = document.getElementById('dvdBoss');
    const armEl = document.getElementById('dvdArm');
    bossEl.style.display = 'block';
    armEl.style.display = 'none';
    
    bossEl.style.width = '200px';
    const bossW = 200, bossH = 200; // Aproximado
    const startX = window.innerWidth/2 - bossW/2;
    const startY = window.innerHeight/2 - bossH/2;
    
    G.dvdBoss = {
      x: startX, y: startY, w: bossW, h: bossH,
      vx: 2.8, vy: 2.8,
      zIndex: 100, hp: 20, maxHp: 20, phase: 1, timer: 0
    };
    bossEl.style.left = startX + 'px';
    bossEl.style.top = startY + 'px';
    bossEl.style.zIndex = 100;
    
    G.dvdArm = { x: 0, y: 0, vx: 0, vy: 0, active: false, timer: 0, w: 300, h: 300 };
    G.bots = [];
    G.greenUnlocked = false;
    G.benja = { 
      x: Math.floor(COLS/2), y: Math.floor(ROWS/2), 
      dir: DIR.DOWN, pTimer: 0, shieldCooldown: 20000, shieldTimer: 0, fireTimer: 0 
    };
  } else {
    // Esconder bosses de nivel 4 si venimos de ahí
    if (document.getElementById('dvdBoss')) document.getElementById('dvdBoss').style.display = 'none';
    if (document.getElementById('dvdArm')) document.getElementById('dvdArm').style.display = 'none';
    
    G.reno = null;
    document.getElementById('hudFruits').style.display = 'flex';
    document.getElementById('hudScore').style.display = 'none';
    const ex=G.mode==='2p'?0|COLS/2:COLS-2, ey=ROWS-2;
    G.enemy={x:ex,y:ey,dir:DIR.DOWN};
    const cfg=ENEMY_CFG[lvl];
    if (cfg) {
      G.eDelay=cfg.delay; G.fireInterval=cfg.fireInterval; G.fireTimer=cfg.fireInterval;
    }
  }
  
  G.fireballs=[]; G.eTimer=0; G.fKeyDown=false; G.spaceDown=false;
  KEYS['Space']=false; KEYS['KeyF']=false;
  G.running=true; updateHUD(); updateFruitCount();
}

function triggerSecretLevel(spriteType = 'body2') {
  G.level = 'secret';
  const g = [];
  for (let y=0;y<ROWS;y++) g.push(new Array(COLS).fill(T.EMPTY));
  for (let x=0;x<COLS;x++){ g[0][x]=T.WALL; g[ROWS-1][x]=T.WALL; }
  for (let y=0;y<ROWS;y++){ g[y][0]=T.WALL; g[y][COLS-1]=T.WALL; }
  G.grid = g;
  G.fruitMap = placeFruits(G.grid, 5);
  
  const p1c=G.p1Char, p2c=G.p2Char;
  G.p1=makePlayer(1,1,p1c);
  if (G.mode==='2p') G.p2=makePlayer(COLS-2,1,p2c);
  else G.p2=null;
  
  G.bossPhase = 0; G.bossHp = 12;
  G.bossState = 'moving'; G.bossAttackT = 10000; G.bossChargeT = 0; G.bossAttackType = 0;
  // Enemigo Body (más delgado: 90 de ancho y 130 de alto)
  G.enemy = { type: spriteType, px: CELL * 3, py: CELL * 3, vx: 3.8, vy: 3.8, w: 90, h: 130 };
  
  G.fireballs=[]; G.eTimer=0; G.fKeyDown=false; G.spaceDown=false;
  KEYS['Space']=false; KEYS['KeyF']=false;
  G.running=true; updateHUD(); updateFruitCount();
  document.getElementById('lvlPill').textContent='Nivel Secreto';
  
  // Cambiar el fondo de la página web completa
  document.body.style.backgroundImage = "url('Assets/fondo-secret.png')";
  
  // Efecto de transparencia en el mapa eliminado para evitar bugs en móviles
  const cvs = document.getElementById('gameCanvas');
  cvs.style.transition = 'none';
  cvs.style.opacity = '1';
  
  bgMusicZ.currentTime = 0;
  let pZ = bgMusicZ.play();
  if (pZ !== undefined && pZ.catch) pZ.catch(e=>console.log('Autoplay blocked:', e));
  
  G.lastT = performance.now();
  loop(G.lastT);
  
  // Mensaje inicial (Fase 0)
  showSecretMsg('¡¡¡Aquí no funcionarán tus bloques!!!');
  
  const isMobile = window.matchMedia("(pointer: coarse)").matches;
  let hint = document.getElementById('pauseHintTxt');
  if (!hint) {
    hint = document.createElement('div');
    hint.id = 'pauseHintTxt';
    document.body.appendChild(hint);
  }
  
  if (isMobile) {
    hint.style.cssText = "position:fixed; top:15px; right:15px; font-size:1.8rem; font-family:'Fredoka One',cursive; background:#ff69b4; border:2px solid #ff1493; border-radius:50%; width:50px; height:50px; color:#fff; display:flex; justify-content:center; align-items:center; z-index:999; cursor:pointer; pointer-events:auto; box-shadow: 0 4px 10px rgba(0,0,0,0.5);";
    hint.textContent = "0";
    hint.onclick = togglePauseSecret;
  } else {
    hint.style.cssText = "position:fixed; bottom:20px; right:25px; font-family:'Fredoka One',cursive; font-size:1.2rem; color:rgba(255,255,255,0.85); text-shadow:0 2px 8px rgba(0,0,0,0.8); z-index:90; pointer-events:none;";
    hint.textContent = "Congelar la carrera= tecla 0";
    hint.onclick = null;
  }
  hint.style.display = isMobile ? 'flex' : 'block';
}

// ════════════════════════════════════════════
//  HUD
// ════════════════════════════════════════════
function updateHUD() {
  document.getElementById('lvlPill').textContent='Nivel '+G.level;
  document.getElementById('hudLblP1').textContent=G.mode==='2p'?'J1':'Vidas';
  renderLives('livesRowP1', G.p1.lives, G.p1.char==='javiera'?'🩷':'💙');
  if(G.mode==='2p'&&G.p2){
    renderLives('livesRowP2',G.p2.lives,G.p2.char==='javiera'?'🩷':'💙');
    document.getElementById('hudP2').style.display='';
  } else document.getElementById('hudP2').style.display='none';
}
function renderLives(rowId,lives,icon){
  const row=document.getElementById(rowId); row.innerHTML='';
  for(let i=0;i<3;i++){ const s=document.createElement('span'); s.className='lv-icon'+(i>=lives?' dead':''); s.textContent=icon; row.appendChild(s); }
}
function updateFruitCount(){
  let n=0; for(let y=0;y<ROWS;y++) for(let x=0;x<COLS;x++) if(G.grid[y][x]===T.FRUIT) n++;
  G.fruitsNum = n;
  document.getElementById('fruitsNum').textContent=n;
}

// ════════════════════════════════════════════
//  LÓGICA
// ════════════════════════════════════════════
function passable(x,y){
  if(x<0||x>=COLS||y<0||y>=ROWS) return false;
  const t=G.grid[y][x]; return t===T.EMPTY||t===T.FRUIT;
}
function shuf4(a){ for(let i=3;i>0;i--){const j=0|Math.random()*(i+1);[a[i],a[j]]=[a[j],a[i]];} }

function doIce(pl){
  if(!G.running||!pl||!pl.active) return;
  const fx=pl.x+DX[pl.dir],fy=pl.y+DY[pl.dir];
  if(fx<0||fx>=COLS||fy<0||fy>=ROWS) return;
  const t=G.grid[fy][fx];
  
  let myIce, myIcon;
  if(G.level==='secret' && G.bossPhase>0) {
    myIce = T.ICE_GREEN; myIcon = '💚';
  } else if (G.level===4 && G.fruitsNum <= 0) {
    myIce = T.ICE_GREEN; myIcon = '💚';
  } else if (pl.char === 'javiera') {
    myIce = T.ICE_PINK; myIcon = '🩷';
  } else if (pl.char === 'paloma') {
    myIce = T.ICE_BLUE; myIcon = '💙';
  } else if (pl.char === 'sofia') {
    myIce = T.ICE_SOFIA; myIcon = '💜';
  } else if (pl.char === 'gbenja') {
    myIce = T.ICE_GBENJA; myIcon = '🤎';
  }
  
  if(t===T.EMPTY){ G.grid[fy][fx]=myIce; boom(fx,fy,myIcon); }
  else if(t===myIce){ G.grid[fy][fx]=T.EMPTY; boom(fx,fy,'💧'); }
}

function updatePlayer(dt){
  if(!G.running) return;
  updateSinglePlayer(G.p1,getDirP1(),dt);
  if(G.mode==='2p'&&G.p2&&G.p2.active) updateSinglePlayer(G.p2,getDirP2(),dt);
}
function updateSinglePlayer(pl,dir,dt){
  if(!pl||!pl.active) return;
  pl.pTimer+=dt; if(pl.pTimer<P_DELAY) return;
  if(dir>=0){
    pl.dir=dir;
    const nx=pl.x+DX[dir],ny=pl.y+DY[dir];
    if(passable(nx,ny)){
      pl.x=nx;pl.y=ny;pl.pTimer=0;
      if(G.grid[ny][nx]===T.FRUIT){ 
        G.grid[ny][nx]=T.EMPTY; delete G.fruitMap[ny*COLS+nx]; boom(nx,ny,'✨');boom(nx,ny,'⭐'); 
        updateFruitCount(); 
        eatSound.currentTime = 0; 
        let pE = eatSound.play();
        if (pE !== undefined && pE.catch) pE.catch(e=>{});
        checkWin();  
      }
    }
  }
}
function checkWin(){ 
  for(let y=0;y<ROWS;y++) for(let x=0;x<COLS;x++) if(G.grid[y][x]===T.FRUIT) return; 
  
  if (G.level === 'secret') {
    if (G.bossPhase === 0) {
      G.bossPhase = 1;
      if (G.p1) boom(G.p1.x, G.p1.y, '✨');
      if (G.p2) boom(G.p2.x, G.p2.y, '✨');
      showSecretMsg('¡¡¡ahora tus bloques le haran daño!!!');
      return; // Sigue jugando, empieza fase 1
    }
    return;
  }
  
  if (G.level === 4) {
    if (!G.greenUnlocked) {
      G.greenUnlocked = true;
      if (G.p1) boom(G.p1.x, G.p1.y, '✨');
      if (G.p2) boom(G.p2.x, G.p2.y, '✨');
      showSecretMsg('¡¡¡ahora tus bloques le haran daño al boss y destruiran los bots!!!');
    }
    return; // El nivel termina cuando el Boss muere (hp <= 0)
  }
  
  G.running=false;cancelAnimationFrame(G.raf);
  stopZMusic();
  setTimeout(()=>G.level>=3?showWin():showLevelDone(),400); 
}

function bfs(sx,sy,tx,ty){
  if(sx===tx&&sy===ty) return -1;
  const vis=new Uint8Array(ROWS*COLS),q=[[sx,sy,-1]];vis[sy*COLS+sx]=1;let head=0;
  while(head<q.length){
    const[cx,cy,fd]=q[head++];
    for(let d=0;d<4;d++){
      const nx=cx+DX[d],ny=cy+DY[d];
      if(nx<0||nx>=COLS||ny<0||ny>=ROWS||vis[ny*COLS+nx]) continue;
      const t=G.grid[ny][nx]; if(t!==T.EMPTY&&t!==T.FRUIT) continue;
      vis[ny*COLS+nx]=1; const nfd=fd===-1?d:fd;
      if(nx===tx&&ny===ty) return nfd;
      q.push([nx,ny,nfd]);
    }
  }
  return -1;
}

function getTarget(){
  const e=G.enemy;
  const p1ok=G.p1&&G.p1.active, p2ok=G.mode==='2p'&&G.p2&&G.p2.active;
  if(!p1ok&&!p2ok) return null; if(!p1ok) return G.p2; if(!p2ok) return G.p1;
  const d1=Math.abs(e.x-G.p1.x)+Math.abs(e.y-G.p1.y);
  const d2=Math.abs(e.x-G.p2.x)+Math.abs(e.y-G.p2.y);
  return d1<=d2?G.p1:G.p2;
}

function activePlayers(){ const a=[]; if(G.p1&&G.p1.active)a.push(G.p1); if(G.mode==='2p'&&G.p2&&G.p2.active)a.push(G.p2); return a; }

function updateEnemy(dt){
  if(!G.running) return;
  
  if (G.level === 'secret') {
    const e = G.enemy;
    const spd = dt / 16.67;
    
    // Detectar colisión precisa con ICE_GREEN (Hitbox completa contra los bloques)
    if (G.bossPhase > 0) {
      const gLeft = Math.floor(e.px / CELL);
      const gRight = Math.floor((e.px + e.w) / CELL);
      const gTop = Math.floor(e.py / CELL);
      const gBottom = Math.floor((e.py + e.h) / CELL);
      
      let hitX = -1, hitY = -1;
      for (let gy = gTop; gy <= gBottom; gy++) {
        for (let gx = gLeft; gx <= gRight; gx++) {
          if (gx>=0 && gx<COLS && gy>=0 && gy<ROWS && G.grid[gy][gx] === T.ICE_GREEN) {
             hitX = gx; hitY = gy; break;
          }
        }
        if (hitX !== -1) break;
      }

      if (hitX !== -1) {
        G.grid[hitY][hitX] = T.EMPTY;
        boom(hitX, hitY, '💥');
        G.bossHp--;
        if (G.bossHp <= 6 && e.type === 'body2') {
          e.type = 'body3';
          boom(e.px+e.w/2, e.py+e.h/2, '💥');
        }
        e.vx *= -1; e.vy *= -1; // Bounce
        if (G.bossHp === 7 && G.bossPhase === 1) { // A Fase 2
          G.bossPhase = 2;
          e.vx = e.vx > 0 ? 5.2 : -5.2; // Acelerar
          e.vy = e.vy > 0 ? 5.2 : -5.2;
          boom(hitX, hitY, '😡');
        } else if (G.bossHp <= 0) {
          G.running = false; cancelAnimationFrame(G.raf); stopZMusic();
          setTimeout(() => showWin(), 600);
          return;
        }
      }
    }
    
    if (G.bossPhase > 0) {
      if (G.bossState === 'moving') {
        G.bossAttackT -= dt;
        if (G.bossAttackT <= 0) {
          G.bossState = 'charging';
          G.bossChargeT = 3000;
          const tg = getTarget();
          G.bossTarget = tg ? {x: tg.x * CELL + CELL/2, y: tg.y * CELL + CELL/2} : {x:e.px+e.w/2, y:e.py+e.h+100};
        }
      } else if (G.bossState === 'charging') {
        G.bossChargeT -= dt;
        if (G.bossChargeT <= 0) {
          G.bossState = 'attacking';
          if (G.bossAttackType === 0) {
            // Lanza sword2
            const cx = e.px + e.w/2, cy = e.py + e.h/2;
            const dx = G.bossTarget.x - cx, dy = G.bossTarget.y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy) || 1;
            G.fireballs.push({
              px: cx, py: cy, vx: (dx/dist)*5.5, vy: (dy/dist)*5.5,
              breaksBlocks: true, alive: true, type: 'sword2', angle: Math.atan2(dy, dx)
            });
            G.bossState = 'moving';
            G.bossAttackT = 10000;
            G.bossAttackType = 1; // Alternate
          } else {
            // Inicia sword1 barrido horizontal estricto
            G.bossChargeT = 1000; // 1s de duracion
            const cx = e.px + e.w/2, cy = e.py + e.h/2;
            const dx = G.bossTarget.x - cx;
            const baseAngle = dx >= 0 ? 0 : Math.PI; // 0 = Derecha, PI = Izquierda
            G.bossSwordAngle = baseAngle - Math.PI/2; 
          }
        }
      } else if (G.bossState === 'attacking' && G.bossAttackType === 1) {
        G.bossChargeT -= dt;
        G.bossSwordAngle += (Math.PI / 1000) * dt; // Barrido de 180°
        
        // Colisión de sword1 con jugador y bloques verdes
        const cx = e.px + e.w/2, cy = e.py + e.h/2;
        const swordLen = 300; // largo de la espada (antes 250)
        const swordHitbox = 0.6; // hitbox moderado

        for (const pl of activePlayers()) {
          if (pl.invincible) continue;
          const plCx = pl.x * CELL + CELL/2, plCy = pl.y * CELL + CELL/2;
          const pdx = plCx - cx, pdy = plCy - cy;
          if (Math.sqrt(pdx*pdx + pdy*pdy) < swordLen) {
            let aDiff = Math.abs(Math.atan2(pdy, pdx) - G.bossSwordAngle);
            while (aDiff > Math.PI) aDiff -= Math.PI*2;
            if (Math.abs(aDiff) < swordHitbox) hitPlayer(pl);
          }
        }

        for (let gy = 1; gy < ROWS-1; gy++) {
          for (let gx = 1; gx < COLS-1; gx++) {
            if (G.grid[gy][gx] === T.ICE_GREEN) {
              const bCx = gx * CELL + CELL/2, bCy = gy * CELL + CELL/2;
              const bdx = bCx - cx, bdy = bCy - cy;
              if (Math.sqrt(bdx*bdx + bdy*bdy) < swordLen) {
                let aDiff = Math.abs(Math.atan2(bdy, bdx) - G.bossSwordAngle);
                while (aDiff > Math.PI) aDiff -= Math.PI*2;
                if (Math.abs(aDiff) < swordHitbox) {
                  G.grid[gy][gx] = T.EMPTY;
                  boom(gx, gy, '💥');
                }
              }
            }
          }
        }
        
        if (G.bossChargeT <= 0) {
          G.bossState = 'moving';
          G.bossAttackT = 10000;
          G.bossAttackType = 0; // Alternate
        }
      }
    }
    
    if (G.bossState === 'moving' || G.bossPhase === 0) {
      e.px += e.vx * spd;
      e.py += e.vy * spd;
    }
    
    // Rebotes contra la pared (usamos la dimensión completa para que no se salga)
    if (e.px <= CELL) { e.px = CELL; e.vx *= -1; }
    if (e.px + e.w >= (COLS-1)*CELL) { e.px = (COLS-1)*CELL - e.w; e.vx *= -1; }
    if (e.py <= CELL) { e.py = CELL; e.vy *= -1; }
    if (e.py + e.h >= (ROWS-1)*CELL) { e.py = (ROWS-1)*CELL - e.h; e.vy *= -1; }
    
    // Colisión basada en rectángulos (hitbox exacta de Body ya que está auto-recortado)
    for (const pl of activePlayers()) {
      if (!pl.invincible) {
        const plPx = pl.x * CELL;
        const plPy = pl.y * CELL;
        if (plPx + CELL - 8 > e.px && plPx + 8 < e.px + e.w &&
            plPy + CELL - 8 > e.py && plPy + 8 < e.py + e.h) {
          hitPlayer(pl);
        }
      }
    }
    return;
  }

  G.eTimer+=dt;
  if(G.eTimer>=G.eDelay){
    G.eTimer=0; const e=G.enemy,tg=getTarget(); if(!tg) return;
    let dir=-1;
    if(G.level===1){ const d=[0,1,2,3];shuf4(d);for(const x of d)if(passable(e.x+DX[x],e.y+DY[x])){dir=x;break;} }
    else if(G.level===2){ if(Math.random()<0.68)dir=bfs(e.x,e.y,tg.x,tg.y); if(dir===-1){const d=[0,1,2,3];shuf4(d);for(const x of d)if(passable(e.x+DX[x],e.y+DY[x])){dir=x;break;}} }
    else{ dir=bfs(e.x,e.y,tg.x,tg.y); if(dir===-1){const d=[0,1,2,3];shuf4(d);for(const x of d)if(passable(e.x+DX[x],e.y+DY[x])){dir=x;break;}} }
    if(dir>=0){const nx=e.x+DX[dir],ny=e.y+DY[dir];if(passable(nx,ny)){e.x=nx;e.y=ny;e.dir=dir;}}
    checkContactHit();
  }
  if(G.fireInterval>0){ G.fireTimer-=dt; if(G.fireTimer<=0){G.fireTimer=G.fireInterval;spawnFireball();} }
}

function updateReno(dt) {
  if (!G.reno || !G.running) return;
  const r = G.reno;
  r.moveTimer += dt;
  if (r.moveTimer >= 220) {
    r.moveTimer = 0;
    let closestPl = null;
    let minDist = Infinity;
    for (const pl of [G.p1, G.p2].filter(Boolean)) {
      if (!pl.active) continue;
      const d = Math.abs(pl.x - r.x) + Math.abs(pl.y - r.y);
      if (d < minDist) { minDist = d; closestPl = pl; }
    }
    
    if (minDist <= 0) {
      catchReno(closestPl);
      return;
    }
    
    if (closestPl) {
      let bestDir = r.dir;
      let maxD = -1;
      const validMoves = [];
      const opts = [0,1,2,3];
      opts.forEach(d => {
        const nx = r.x + DX[d];
        const ny = r.y + DY[d];
        if (nx>0 && nx<COLS-1 && ny>0 && ny<ROWS-1 && (G.grid[ny][nx]===T.EMPTY || G.grid[ny][nx]===T.FRUIT)) {
          const ndx = nx - closestPl.x;
          const ndy = ny - closestPl.y;
          const ndist = Math.abs(ndx) + Math.abs(ndy);
          if (ndist > maxD) { maxD = ndist; bestDir = d; }
          validMoves.push(d);
        }
      });
      
      if (validMoves.length > 0) {
        if (!validMoves.includes(bestDir)) bestDir = validMoves[0];
        r.dir = bestDir;
        r.x += DX[bestDir];
        r.y += DY[bestDir];
      }
    }
  }
  
  for (const pl of [G.p1, G.p2].filter(Boolean)) {
    if (!pl.active) continue;
    if (Math.abs(pl.x - r.x) + Math.abs(pl.y - r.y) <= 0) {
      catchReno(pl);
      break;
    }
  }
}

function catchReno(pl) {
  boom(G.reno.x, G.reno.y, '✨');
  eatSound.play();
  if (pl === G.p1) G.scoreP1 += 100;
  else G.scoreP2 += 100;
  
  document.getElementById('scoreText').textContent = G.mode === '2p' ? `${G.scoreP1} - ${G.scoreP2}` : G.scoreP1;
  
  if (G.mode === '1p') {
    if (G.scoreP1 >= 5000) {
      G.running = false;
      cancelAnimationFrame(G.raf);
      stopZMusic();
      setTimeout(() => showWin(), 600);
      return;
    }
  } else {
    if (Math.abs(G.scoreP1 - G.scoreP2) >= 5000) {
      G.running = false;
      cancelAnimationFrame(G.raf);
      stopZMusic();
      setTimeout(() => showWin(), 600);
      return;
    }
  }
  
  let placed = false, tries = 0;
  while (!placed && tries < 200) {
    const rx = 1+(0|Math.random()*(COLS-2));
    const ry = 1+(0|Math.random()*(ROWS-2));
    if (G.grid[ry][rx] === T.EMPTY || G.grid[ry][rx] === T.FRUIT) {
      G.reno.x = rx; G.reno.y = ry; placed = true;
    }
    tries++;
  }
}

function spawnFireball(){
  const tg=getTarget();if(!tg)return;
  const e=G.enemy,dx=tg.x-e.x,dy=tg.y-e.y;
  let vx=0,vy=0;
  if(Math.abs(dx)>=Math.abs(dy))vx=dx>0?1:-1;else vy=dy>0?1:-1;
  if(!vx&&!vy)return;
  G.fireballs.push({px:e.x*CELL+CELL/2,py:e.y*CELL+CELL/2,vx:vx*4.5,vy:vy*4.5,breaksBlocks:ENEMY_CFG[G.level].breaksBlocks,alive:true});
  boom(e.x,e.y,'🔥');
}

function updateFireballs(dt){
  if(!G.running)return;
  const spd=dt/16.67;
  for(const fb of G.fireballs){
    if(!fb.alive)continue;
    fb.px+=fb.vx*spd;fb.py+=fb.vy*spd;
    const gx=Math.floor(fb.px/CELL),gy=Math.floor(fb.py/CELL);
    if (fb.type === 'sword2') {
      if (fb.px < -200 || fb.px > canvas.width+200 || fb.py < -200 || fb.py > canvas.height+200) fb.alive=false;
      if (gx>=0 && gx<COLS && gy>=0 && gy<ROWS && G.grid[gy][gx] === T.ICE_GREEN) {
        G.grid[gy][gx] = T.EMPTY; boom(gx, gy, '💥'); fb.alive = false; continue;
      }
      for(const pl of activePlayers()){
        if(!pl.invincible) {
          const pCx = pl.x * CELL + CELL/2, pCy = pl.y * CELL + CELL/2;
          const dist = Math.sqrt((fb.px-pCx)**2 + (fb.py-pCy)**2);
          if (dist < CELL) { fb.alive=false; hitPlayer(pl); return; }
        }
      }
      continue;
    }
    
    if (fb.isFriendly) {
      if (G.level === 4 && G.bots) {
        for (const bot of G.bots) {
          if (!bot.dead && bot.x === gx && bot.y === gy) {
             bot.dead = true; boom(bot.x, bot.y, '💥'); fb.alive = false;
          }
        }
      }
      if (G.level === 4 && fb.alive) {
         const rect = canvas.getBoundingClientRect();
         const scaleX = rect.width / canvas.width, scaleY = rect.height / canvas.height;
         const fbScreenX = rect.left + fb.px * scaleX, fbScreenY = rect.top + fb.py * scaleY;
         const bossRect = document.getElementById('dvdBoss').getBoundingClientRect();
         if (fbScreenX >= bossRect.left && fbScreenX <= bossRect.right && fbScreenY >= bossRect.top && fbScreenY <= bossRect.bottom) {
            damageBossLevel4(); fb.alive = false;
         }
      }
      if(gx<0||gx>=COLS||gy<0||gy>=ROWS){fb.alive=false;continue;}
      if(G.grid[gy][gx]===T.WALL){fb.alive=false;continue;}
      continue;
    }

    if(gx<0||gx>=COLS||gy<0||gy>=ROWS){fb.alive=false;continue;}
    const t=G.grid[gy][gx];
    if(t===T.WALL){fb.alive=false;continue;}
    if(t===T.ICE_PINK||t===T.ICE_BLUE||t===T.ICE_SOFIA||t===T.ICE_GBENJA){if(fb.breaksBlocks){G.grid[gy][gx]=T.EMPTY;boom(gx,gy,'💥');}fb.alive=false;continue;}
    for(const pl of activePlayers()){if(!pl.invincible&&gx===pl.x&&gy===pl.y){fb.alive=false;hitPlayer(pl);return;}}
  }
  G.fireballs=G.fireballs.filter(fb=>fb.alive);
}

function checkContactHit(){ for(const pl of activePlayers()) if(!pl.invincible&&pl.x===G.enemy.x&&pl.y===G.enemy.y) hitPlayer(pl); }

function hitPlayer(pl){
  if(!G.running||!pl||!pl.active)return;
  pl.lives--; boom(pl.x,pl.y,'💥');boom(pl.x,pl.y,'💫'); updateHUD();
  if(pl.lives<=0){
    pl.active=false;
    if(activePlayers().length===0){G.running=false;cancelAnimationFrame(G.raf);stopZMusic();setTimeout(showGameOver,700);}
  } else {
    setTimeout(()=>{if(!G.running)return;pl.x=pl.startX;pl.y=pl.startY;pl.dir=DIR.DOWN;pl.invincible=true;pl.invTimer=2200;pl.pTimer=0;},900);
  }
}

// ════════════════════════════════════════════
//  RENDERIZADO
// ════════════════════════════════════════════
const SPR_PAD  = 2;
const SPR_SIZE = CELL - SPR_PAD * 2;

function drawBg(){
  // Fondo azul oscuro opaco
  ctx.fillStyle='#0d1b2a'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='rgba(40,90,160,0.15)'; ctx.lineWidth=1;
  for(let x=0;x<=COLS;x++){ctx.beginPath();ctx.moveTo(x*CELL,0);ctx.lineTo(x*CELL,canvas.height);ctx.stroke();}
  for(let y=0;y<=ROWS;y++){ctx.beginPath();ctx.moveTo(0,y*CELL);ctx.lineTo(canvas.width,y*CELL);ctx.stroke();}
}

function drawWall(x,y){
  const px=x*CELL,py=y*CELL;
  ctx.fillStyle='#1a3f6f';ctx.fillRect(px,py,CELL,CELL);
  ctx.fillStyle='rgba(100,180,255,0.22)';ctx.fillRect(px,py,CELL,4);ctx.fillRect(px,py,4,CELL);
  ctx.fillStyle='rgba(0,5,20,0.5)';ctx.fillRect(px+CELL-4,py+4,4,CELL-4);ctx.fillRect(px+4,py+CELL-4,CELL-8,4);
  ctx.strokeStyle='rgba(60,140,230,0.4)';ctx.lineWidth=1;ctx.strokeRect(px+0.5,py+0.5,CELL-1,CELL-1);
  ctx.fillStyle='rgba(160,220,255,0.15)';ctx.fillRect(px+6,py+6,5,5);ctx.fillRect(px+22,py+22,5,5);
}

function drawIce(x,y,color){
  let overrideImgKey = null;
  if (color === 'pink') {
     const skin = CHAR_SKINS.javiera[G.skins.javiera];
     overrideImgKey = skin === 'normal' ? null : `javiera_${skin}_ice`;
  } else if (color === 'blue') {
     const skin = CHAR_SKINS.paloma[G.skins.paloma];
     overrideImgKey = skin === 'normal' ? null : `paloma_${skin}_ice`;
  } else if (color === 'sofia') {
     const skin = CHAR_SKINS.sofia[G.skins.sofia];
     overrideImgKey = skin === 'normal' ? 'sofia_ice' : `sofia_${skin}_ice`;
  } else if (color === 'gbenja') {
     const skin = CHAR_SKINS.gbenja[G.skins.gbenja];
     overrideImgKey = skin === 'normal' ? 'gbenja_ice' : `gbenja_${skin}_ice`;
  }
  
  if (overrideImgKey && IMG[overrideImgKey]) {
    const px=x*CELL+SPR_PAD, py=y*CELL+SPR_PAD;
    ctx.drawImage(IMG[overrideImgKey], px, py, SPR_SIZE, SPR_SIZE);
    return;
  }

  const px=x*CELL+2,py=y*CELL+2,s=CELL-4;
  const isS = color==='sofia', isG = color==='gbenja';
  let mc='rgba(50,180,255,0.52)', bc='rgba(20,150,240,0.92)', sc='rgba(200,240,255,0.75)';
  if (color==='pink') { mc='rgba(255,100,185,0.52)'; bc='rgba(230,50,145,0.92)'; sc='rgba(255,200,235,0.75)'; }
  else if (color==='green') { mc='rgba(50,255,100,0.52)'; bc='rgba(20,240,50,0.92)'; sc='rgba(200,255,200,0.75)'; }
  else if (isS) { mc='rgba(150,50,255,0.52)'; bc='rgba(130,20,240,0.92)'; sc='rgba(230,200,255,0.75)'; }
  else if (isG) { mc='rgba(255,150,50,0.52)'; bc='rgba(240,120,20,0.92)'; sc='rgba(255,220,180,0.75)'; }
  
  ctx.fillStyle=mc;ctx.fillRect(px,py,s,s);
  ctx.fillStyle=sc;ctx.fillRect(px+3,py+3,11,3);ctx.fillRect(px+3,py+3,3,11);
  ctx.strokeStyle=bc;ctx.lineWidth=2.5;ctx.strokeRect(px,py,s,s);
  ctx.fillStyle=sc;ctx.beginPath();ctx.arc(px+s-8,py+s-8,3,0,Math.PI*2);ctx.fill();
}

function drawFruit(x, y, now) {
  const cx  = x * CELL + CELL / 2;
  const cy  = y * CELL + CELL / 2 + Math.sin(now * 0.003 + x * 0.8 + y * 1.1) * 3;
  const emoji = G.fruitMap[y * COLS + x] || '🍒';

  ctx.save();

  // Halo brillante detrás de la fruta para que se vea sobre el fondo oscuro
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 17);
  glow.addColorStop(0,   'rgba(255, 255, 200, 0.55)');
  glow.addColorStop(0.5, 'rgba(255, 230, 80,  0.25)');
  glow.addColorStop(1,   'rgba(255, 200, 0,   0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, 17, 0, Math.PI * 2);
  ctx.fill();

  // Sombra suave para dar profundidad
  ctx.shadowColor  = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur   = 4;
  ctx.shadowOffsetY = 2;

  // Emoji grande y centrado
  ctx.font         = '28px serif';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, cx, cy);

  ctx.restore();
}

function drawFireballs(now){
  for(const fb of G.fireballs){
    if(!fb.alive)continue;
    ctx.save();ctx.translate(fb.px,fb.py);
    if (fb.type === 'sword2') {
      ctx.rotate(fb.angle + Math.PI/2);
      if (IMG['sword2']) {
        ctx.drawImage(IMG['sword2'], -20, -50, 40, 100);
      } else {
        ctx.fillStyle='white'; ctx.fillRect(-5,-30,10,60);
      }
    } else {
      const pulse=0.85+Math.sin(now*0.02)*0.15;
      ctx.shadowBlur=18;ctx.shadowColor=fb.breaksBlocks?'rgba(255,80,0,0.9)':'rgba(255,160,0,0.8)';
      const r=6*pulse,g2=ctx.createRadialGradient(0,0,0,0,0,r*2);
      g2.addColorStop(0,'rgba(255,255,200,1)');
      g2.addColorStop(0.4,fb.breaksBlocks?'rgba(255,80,0,0.9)':'rgba(255,180,0,0.85)');
      g2.addColorStop(1,'rgba(255,80,0,0)');
      ctx.fillStyle=g2;ctx.beginPath();ctx.arc(0,0,r*2,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
    }
    ctx.restore();
  }
}

// ── Dibujar sprite (ya sin fondo blanco tras preprocesado) ──
function drawSprite(key, cx, cy, isInvincible){
  const src=IMG[key];
  const px=cx*CELL+SPR_PAD, py=cy*CELL+SPR_PAD;

  if(!src){
    // Fallback: círculo de color
    const base=key.split('_')[0];
    ctx.fillStyle=FALLBACK_COL[base]||'#888';
    ctx.beginPath();ctx.arc(cx*CELL+CELL/2,cy*CELL+CELL/2,14,0,Math.PI*2);ctx.fill();
    return;
  }
  
  if (isInvincible) {
    ctx.save();
    // Filtro amarillo para inmunidad
    ctx.filter = 'sepia(1) hue-rotate(15deg) saturate(3) brightness(1.2) drop-shadow(0px 0px 8px yellow)';
    ctx.drawImage(src, px, py, SPR_SIZE, SPR_SIZE);
    ctx.restore();
  } else {
    ctx.drawImage(src, px, py, SPR_SIZE, SPR_SIZE);
  }
}

function getEnemyKey(){ const b=ENEMY_CFG[G.level].key; switch(G.enemy.dir){case DIR.UP:return b+'_up';case DIR.LEFT:return b+'_left';case DIR.RIGHT:return b+'_right';default:return b+'_down';} }
function getCharKey(pl){ 
  let base = pl.char;
  const skins = CHAR_SKINS[pl.char];
  if (skins) {
    const activeSkin = skins[G.skins[pl.char] || 0];
    if (activeSkin !== 'normal') base = `${pl.char}_${activeSkin}`;
  }
  switch(pl.dir){case DIR.UP:return base+'_up';case DIR.LEFT:return base+'_left';case DIR.RIGHT:return base+'_right';default:return base+'_down';} 
}

function render(now){
  ctx.imageSmoothingEnabled = false;
  drawBg();

  // Pase 1: paredes y bloques de gelatina
  for(let y=0;y<ROWS;y++) for(let x=0;x<COLS;x++){
    const t=G.grid[y][x];
    if(t===T.WALL)     drawWall(x,y);
    else if(t===T.ICE_PINK) drawIce(x,y,'pink');
    else if(t===T.ICE_BLUE) drawIce(x,y,'blue');
    else if(t===T.ICE_GREEN) drawIce(x,y,'green');
    else if(t===T.ICE_SOFIA) drawIce(x,y,'sofia');
    else if(t===T.ICE_GBENJA) drawIce(x,y,'gbenja');
  }

  // Pase 2: bolas de fuego y sprites
  drawFireballs(now);
  if (G.level === 'secret') {
    if (IMG[G.enemy.type]) ctx.drawImage(IMG[G.enemy.type], G.enemy.px, G.enemy.py, G.enemy.w, G.enemy.h);
    
    // Dibujar espadas de jefe
    const cx = G.enemy.px + G.enemy.w/2, cy = G.enemy.py + G.enemy.h/2;
    if (G.bossState === 'charging') {
      ctx.save();
      ctx.globalAlpha = 0.5 + Math.sin(now * 0.01) * 0.2; // Transparente y parpadeante
      const dx = G.bossTarget.x - cx, dy = G.bossTarget.y - cy;
      ctx.translate(cx, cy);
      if (G.bossAttackType === 0) {
        // sword2 fantasma
        const angle = Math.atan2(dy, dx);
        ctx.rotate(angle + Math.PI/2);
        if (IMG['sword2']) ctx.drawImage(IMG['sword2'], -20, -50, 40, 100);
      } else {
        // sword1 fantasma (larga y estrecha, rotada 90 grados)
        const angle = dx >= 0 ? 0 : Math.PI;
        ctx.rotate(angle + Math.PI/2);
        if (IMG['sword1']) ctx.drawImage(IMG['sword1'], -6, 0, 12, -300);
      }
      ctx.restore();
    } else if (G.bossState === 'attacking' && G.bossAttackType === 1) {
      // sword1 barriendo (solido)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(G.bossSwordAngle + Math.PI/2);
      if (IMG['sword1']) ctx.drawImage(IMG['sword1'], -6, 0, 12, -300);
      ctx.restore();
    }
  } else if (G.level === 'reno') {
    if (G.reno) {
      const key = G.reno.dir === DIR.LEFT || G.reno.dir === DIR.DOWN ? 'reno_izquierda' : 'reno_derecha';
      drawSprite(key, G.reno.x, G.reno.y, false);
    }
  } else if (G.level === 4) {
    // Dibujar bots
    if (G.bots) {
      for (const bot of G.bots) {
        let bKey = bot.type;
        switch(bot.dir){case DIR.UP:bKey+='_up';break;case DIR.LEFT:bKey+='_left';break;case DIR.RIGHT:bKey+='_right';break;default:bKey+='_down';}
        drawSprite(bKey, bot.x, bot.y, false);
      }
    }
    // Dibujar Benja
    if (G.benja) {
      let bKey = 'benja';
      switch(G.benja.dir){case DIR.UP:bKey+='_up';break;case DIR.LEFT:bKey+='_left';break;case DIR.RIGHT:bKey+='_right';break;default:bKey+='_down';}
      drawSprite(bKey, G.benja.x, G.benja.y, false);
    }
  } else {
    drawSprite(getEnemyKey(),G.enemy.x,G.enemy.y,false);
  }
  if(G.p1&&G.p1.active) drawSprite(getCharKey(G.p1),G.p1.x,G.p1.y,G.p1.invincible);
  if(G.mode==='2p'&&G.p2&&G.p2.active) drawSprite(getCharKey(G.p2),G.p2.x,G.p2.y,G.p2.invincible);

  // Pase 3 (último): frutas siempre encima de todo, sin opacidad
  for(let y=0;y<ROWS;y++) for(let x=0;x<COLS;x++){
    if(G.grid[y][x]===T.FRUIT) drawFruit(x,y,now);
  }
  
  // HUD especial Boss
  let drawBossBar = false;
  let bIcon = null, bMaxHp = 1, bHp = 0, bColor = '#ff3300';
  
  if (G.level === 'secret' && G.bossPhase > 0) {
    drawBossBar = true;
    bIcon = G.bossPhase === 1 ? IMG['face'] : IMG['furious'];
    bMaxHp = 12;
    bHp = Math.max(0, G.bossHp);
    bColor = G.bossPhase === 1 ? '#ffcc00' : '#ff3300';
  } else if (G.level === 4 && G.dvdBoss) {
    drawBossBar = true;
    // El boss del nivel 4 usa imagen de DOM, no la dibujamos aquí (o se puede omitir el icono)
    bMaxHp = G.dvdBoss.maxHp;
    bHp = Math.max(0, G.dvdBoss.hp);
    bColor = '#ff3300';
  }

  if (drawBossBar) {
    const barW = 300, barH = 20, px = canvas.width/2 - barW/2, py = 15;
    
    // Fondo de la barra
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(px, py, barW, barH);
    // Relleno de vida
    ctx.fillStyle = bColor;
    ctx.fillRect(px+2, py+2, (barW-4) * (bHp/bMaxHp), barH-4);
    
    // Ícono a la izquierda de la barra (ampliado para que destaquen face y furious)
    if (bIcon) {
      ctx.drawImage(bIcon, px - 60, py - 25, 75, 75);
    }
  }
}

// ════════════════════════════════════════════
//  LOOP
// ════════════════════════════════════════════
function loop(ts){
  const dt=Math.min(ts-G.lastT,80); G.lastT=ts;
  if (!G.paused) {
    for(const pl of [G.p1,G.p2].filter(Boolean))
      if(pl.invincible){pl.invTimer-=dt;if(pl.invTimer<=0)pl.invincible=false;}
    updatePlayer(dt); 
    if (G.level === 'reno') updateReno(dt);
    else if (G.level === 4) updateLevel4(dt);
    else updateEnemy(dt); 
    updateFireballs(dt);
  }
  render(ts);
  if(G.running) G.raf=requestAnimationFrame(loop);
}

function spawnLevel4Arm() {
  if (G.dvdArm.active) return;
  G.dvdArm.active = true;
  G.dvdArm.done = false;
  G.dvdArm.timer = 0;
  
  const armEl = document.getElementById('dvdArm');
  armEl.style.display = 'block';
  
  if (G.dvdArm.lastSide === undefined) G.dvdArm.lastSide = false;
  const isLeft = !G.dvdArm.lastSide;
  G.dvdArm.lastSide = isLeft;
  
  armEl.src = isLeft ? 'Assets/Arm-izquierda.png' : 'Assets/Arm-derecha.png';
  
  G.dvdArm.side = isLeft ? 'left' : 'right';
  
  // Reducir tamaño del brazo
  const canvasRect = canvas.getBoundingClientRect();
  armEl.style.width = (canvasRect.width * 0.30) + 'px'; // Un poco más grande, 30% del mapa
  armEl.style.height = 'auto';
  
  // Usaremos timeouts cortos para dejar que renderice y tome las medidas
  setTimeout(() => {
    const rect = armEl.getBoundingClientRect();
    const cRect = canvas.getBoundingClientRect();
    G.dvdArm.length = rect.width;
    G.dvdArm.thickness = rect.height;
    
    if (isLeft) {
       G.dvdArm.anchorX = cRect.left;
       G.dvdArm.anchorY = cRect.bottom;
       armEl.style.left = cRect.left + 'px';
       armEl.style.top = (cRect.bottom - rect.height) + 'px';
       armEl.style.transformOrigin = 'left bottom';
       G.dvdArm.angle = 90; // Empezar apuntando hacia abajo
       G.dvdArm.targetAngle = 0; 
    } else {
       G.dvdArm.anchorX = cRect.right;
       G.dvdArm.anchorY = cRect.bottom;
       armEl.style.left = (cRect.right - rect.width) + 'px';
       armEl.style.top = (cRect.bottom - rect.height) + 'px';
       armEl.style.transformOrigin = 'right bottom';
       G.dvdArm.angle = -90; // Empezar apuntando hacia abajo
       G.dvdArm.targetAngle = 0; 
    }
    armEl.style.transform = `rotate(${G.dvdArm.angle}deg)`;
  }, 50);
}

function damageBossLevel4() {
  if (G.level !== 4 || G.dvdBoss.hp <= 0) return;
  G.dvdBoss.hp--;
  boom(COLS/2, ROWS/2, '💢'); // Visual in middle of screen
  
  if (G.dvdBoss.hp <= 13 && G.dvdBoss.phase === 1) G.dvdBoss.phase = 2;
  if (G.dvdBoss.hp <= 6 && G.dvdBoss.phase === 2) G.dvdBoss.phase = 3;
  
  if (G.dvdBoss.hp <= 0) {
     document.getElementById('dvdBoss').style.display = 'none';
     document.getElementById('dvdArm').style.display = 'none';
     G.running = false; cancelAnimationFrame(G.raf); stopZMusic();
     setTimeout(() => showWin(), 600);
  }
}

function updateLevel4(dt) {
  if (!G.running) return;
  
  // Update Boss
  const bossEl = document.getElementById('dvdBoss');
  const b = G.dvdBoss;
  b.x += b.vx * (dt/16.6);
  b.y += b.vy * (dt/16.6);
  
  let bounced = false;
  if (b.x < 0) { b.x = 0; b.vx *= -1; bounced = true; }
  if (b.x + b.w > window.innerWidth) { b.x = window.innerWidth - b.w; b.vx *= -1; bounced = true; }
  if (b.y < 0) { b.y = 0; b.vy *= -1; bounced = true; }
  if (b.y + b.h > window.innerHeight) { b.y = window.innerHeight - b.h; b.vy *= -1; bounced = true; }
  
  bossEl.style.left = b.x + 'px';
  bossEl.style.top = b.y + 'px';
  
  if (bounced && Math.random() < 0.3) {
    b.zIndex = b.zIndex === 100 ? 0 : 100;
    bossEl.style.zIndex = b.zIndex;
    if (b.zIndex === 0 && Math.random() < 0.5) spawnLevel4Arm();
  }
  
  // Boss Collisions (Grid & Player)
  const bossRect = bossEl.getBoundingClientRect();
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
  
  let marginX = 40; // Engostar hitbox horizontalmente
  let marginY = 30; // Engostar hitbox verticalmente
  let bL = (bossRect.left - rect.left) * scaleX + marginX, bT = (bossRect.top - rect.top) * scaleY + marginY;
  let bR = (bossRect.right - rect.left) * scaleX - marginX, bB = (bossRect.bottom - rect.top) * scaleY - marginY;
  
  let gLeft = Math.floor(bL / CELL), gRight = Math.floor(bR / CELL);
  let gTop = Math.floor(bT / CELL), gBottom = Math.floor(bB / CELL);
  
  for (let gy = Math.max(0, gTop); gy <= Math.min(ROWS-1, gBottom); gy++) {
    for (let gx = Math.max(0, gLeft); gx <= Math.min(COLS-1, gRight); gx++) {
      if (G.grid[gy][gx] === T.ICE_GREEN) {
         G.grid[gy][gx] = T.EMPTY;
         boom(gx, gy, '💥');
         damageBossLevel4();
      }
    }
  }
  
  for (const pl of activePlayers()) {
    if (pl.invincible) continue;
    if (bL/CELL < pl.x+0.8 && bR/CELL > pl.x && bT/CELL < pl.y+0.8 && bB/CELL > pl.y) {
       if (b.zIndex === 100) hitPlayer(pl);
    }
  }
  
  // Update Arm (Rotatorio limpiaparabrisas)
  if (G.dvdArm.active) {
    const a = G.dvdArm;
    const speed = 28; // Grados por segundo (velocidad moderada-rápida)
    
    if (!a.done) {
      if (!a.length || !a.thickness) return; // Wait until layout is calculated
      
      if (a.angle < a.targetAngle) {
         a.angle += speed * (dt/1000);
         if (a.angle >= a.targetAngle) { a.angle = a.targetAngle; a.done = true; }
      } else {
         a.angle -= speed * (dt/1000);
         if (a.angle <= a.targetAngle) { a.angle = a.targetAngle; a.done = true; }
      }
      
      const armEl = document.getElementById('dvdArm');
      armEl.style.transform = `rotate(${a.angle}deg)`;
      
      // Colisión (Distancia de punto a segmento)
      const rad = a.angle * Math.PI / 180;
      let endX, endY;
      if (a.side === 'left') {
         endX = a.anchorX + a.length * Math.cos(rad);
         endY = a.anchorY + a.length * Math.sin(rad);
      } else {
         endX = a.anchorX - a.length * Math.cos(rad);
         endY = a.anchorY - a.length * Math.sin(rad);
      }
      
      const distToSegment = (px, py, x1, y1, x2, y2) => {
        const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        if (l2 === 0) return Math.sqrt((px - x1)*(px - x1) + (py - y1)*(py - y1));
        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        const projX = x1 + t * (x2 - x1);
        const projY = y1 + t * (y2 - y1);
        return Math.sqrt((px - projX)*(px - projX) + (py - projY)*(py - projY));
      };
      
      for (const pl of activePlayers()) {
        if (pl.invincible) continue;
        const plScreenX = rect.left + (pl.x * CELL + CELL/2) * (rect.width / canvas.width);
        const plScreenY = rect.top + (pl.y * CELL + CELL/2) * (rect.height / canvas.height);
        
        const dist = distToSegment(plScreenX, plScreenY, a.anchorX, a.anchorY, endX, endY);
        if (dist < a.thickness / 2 + 10) { // 10px margen extra de la hitbox del personaje
           hitPlayer(pl);
        }
      }
    } else {
      a.timer += dt;
      if (a.timer > 800) {
        a.active = false;
        document.getElementById('dvdArm').style.display = 'none';
      }
    }
  }
  
  // Bots Management
  b.timer += dt;
  if (b.timer > 5000) {
    b.timer = 0;
    const type = b.phase === 1 ? 'bot1' : (b.phase === 2 ? 'bot2' : (Math.random()<0.5?'bot1':'bot2'));
    let bx = 1+(0|Math.random()*(COLS-2)), by = 1+(0|Math.random()*(ROWS-2));
    if (G.grid[by][bx] === T.EMPTY) {
      G.bots.push({x: bx, y: by, dir: DIR.DOWN, type: type, moveTimer: 0, delay: type==='bot1'?500:1000, dead: false});
    }
  }
  
  for (const bot of G.bots) {
    if (bot.dead) continue;
    bot.moveTimer += dt;
    if (bot.moveTimer > bot.delay) {
      bot.moveTimer = 0;
      const tg = getTarget();
      if (tg) {
        let dir = bfs(bot.x, bot.y, tg.x, tg.y);
        if (dir === -1) {
           const d = [0,1,2,3]; shuf4(d);
           for(const x of d) if(passable(bot.x+DX[x], bot.y+DY[x])){dir=x;break;}
        }
        if (dir>=0) {
           const nx=bot.x+DX[dir], ny=bot.y+DY[dir];
           if(passable(nx,ny)){bot.x=nx;bot.y=ny;bot.dir=dir;}
        }
      }
    }
    for(const pl of activePlayers()) {
      if(!pl.invincible && pl.x===bot.x && pl.y===bot.y) hitPlayer(pl);
    }
    if (G.grid[bot.y][bot.x] === T.ICE_GREEN) {
       bot.dead = true; G.grid[bot.y][bot.x] = T.EMPTY; boom(bot.x, bot.y, '💥');
    }
  }
  G.bots = G.bots.filter(bt => !bt.dead);
  
  // Benja Management
  const bj = G.benja;
  bj.pTimer += dt;
  if (bj.pTimer > 300) {
    bj.pTimer = 0;
    const d = [0,1,2,3]; shuf4(d);
    for(const x of d) if(passable(bj.x+DX[x], bj.y+DY[x])){bj.dir=x; bj.x+=DX[x]; bj.y+=DY[x]; break;}
  }
  
  bj.shieldTimer += dt;
  if (bj.shieldTimer > bj.shieldCooldown) {
    bj.shieldTimer = 0;
    for (const pl of activePlayers()) {
       pl.invincible = true; pl.invTimer = 5000; boom(pl.x, pl.y, '🛡️');
    }
  }
  
  bj.fireTimer += dt;
  if (bj.fireTimer > 2000) {
    bj.fireTimer = 0;
    let targetX, targetY;
    if (G.bots.length > 0) {
       targetX = G.bots[0].x * CELL + CELL/2; targetY = G.bots[0].y * CELL + CELL/2;
    } else {
       targetX = bL + (bR-bL)/2; targetY = bT + (bB-bT)/2;
    }
    const cx = bj.x * CELL + CELL/2, cy = bj.y * CELL + CELL/2;
    const dx = targetX - cx, dy = targetY - cy;
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
    G.fireballs.push({
      px: cx, py: cy, vx: (dx/dist)*6.5, vy: (dy/dist)*6.5,
      breaksBlocks: false, alive: true, type: 'benjaFire', isFriendly: true
    });
  }
}

// ════════════════════════════════════════════
//  PARTÍCULAS
// ════════════════════════════════════════════
function boom(gx,gy,emoji){
  const rect=canvas.getBoundingClientRect();
  const sx=rect.left+(gx*CELL+CELL/2)*(rect.width/canvas.width);
  const sy=rect.top +(gy*CELL+CELL/2)*(rect.height/canvas.height);
  const el=document.createElement('div');
  el.className='ptcl';el.textContent=emoji;
  el.style.left=sx+'px';el.style.top=sy+'px';
  el.style.setProperty('--tx',((Math.random()-.5)*90)+'px');
  el.style.setProperty('--ty',(-25-Math.random()*50)+'px');
  document.body.appendChild(el);setTimeout(()=>el.remove(),900);
}

// ════════════════════════════════════════════
//  CINEMÁTICAS
// ════════════════════════════════════════════
let _cinCb=null;
function playCinematic(src,cb){
  const sc=document.getElementById('cinematicScreen'),vi=document.getElementById('cinematicVideo');
  _cinCb=cb; if(G.running){G.running=false;cancelAnimationFrame(G.raf);}
  vi.src=src;vi.currentTime=0;vi.volume=1;sc.classList.add('active');
  vi.onended=()=>endCinematic();vi.onerror=()=>endCinematic();
  const p=vi.play();if(p&&p.catch)p.catch(()=>endCinematic());
}
function endCinematic(){
  const sc=document.getElementById('cinematicScreen'),vi=document.getElementById('cinematicVideo');
  vi.pause();vi.src='';sc.classList.remove('active');
  const cb=_cinCb;_cinCb=null;if(cb)cb();
}
function skipCinematic(){endCinematic();}

// ════════════════════════════════════════════
//  ANUNCIO DE NIVEL
// ════════════════════════════════════════════
function announceLevel(txt,cb){
  const el=document.getElementById('laText');
  el.textContent=txt;el.classList.remove('hide');el.classList.add('show');
  setTimeout(()=>{el.classList.remove('show');el.classList.add('hide');setTimeout(()=>{el.classList.remove('hide');if(cb)cb();},350);},1400);
}

function showSecretMsg(txt) {
  let el = document.getElementById('secretMsgOvl');
  if (!el) {
    el = document.createElement('div');
    el.id = 'secretMsgOvl';
    el.style.cssText = "position:fixed; top:25%; left:0; width:100vw; text-align:center; font-family:'Fredoka One',cursive; font-size:3.5rem; color:#ff0000; text-shadow:0 4px 15px rgba(0,0,0,0.8), 0 -2px 8px rgba(255,255,255,0.6); z-index:999999; pointer-events:none; display:none; opacity:0.75;";
    document.body.appendChild(el);
  }
  el.textContent = txt;
  el.style.display = 'block';
  
  if (el.msgTimeout) clearTimeout(el.msgTimeout);
  el.msgTimeout = setTimeout(() => {
    el.style.display = 'none';
  }, 5000);
}

// ════════════════════════════════════════════
//  OVERLAYS Y FLUJO
// ════════════════════════════════════════════
function showOv(id){ 
  document.querySelectorAll('.overlay').forEach(o=>o.classList.remove('active')); 
  if(id)document.getElementById(id).classList.add('active'); 
  if(id && id !== 'ovPause') {
    if (document.getElementById('dvdBoss')) document.getElementById('dvdBoss').style.display = 'none';
    if (document.getElementById('dvdArm')) document.getElementById('dvdArm').style.display = 'none';
  }
}

function showLevelDone(){
  const n={1:'Bot1 🤖',2:'Bot2 🔥',3:'Benja 👹'};
  document.getElementById('ovLvlT').textContent='Nivel '+G.level+' Completado';
  document.getElementById('ovLvlS').textContent=G.level<3?'¡Genial! Derrotaron al '+n[G.level]+'. El nivel '+(G.level+1)+' es mas dificil...':'¡Derrotaron a todos!';
  showOv('ovLevelDone');
}
function showGameOver(){
  if (G.level === 'secret') {
    playCinematic('Assets/go-secret.mp4', () => showOv('ovGameOver'));
  } else {
    playCinematic('Assets/game-over.mp4', () => showOv('ovGameOver'));
  }
}
function showWin(){
  const who=G.mode==='2p'?'Javiera y Paloma':(G.p1.char==='javiera'?'Javiera':'Paloma');
  document.getElementById('ovWinS').textContent='!'+who+' vencio a Bot1, Bot2 y Benja! 🫧✨';
  const vid = G.level === 'secret' ? 'Assets/fin-nivelSecret.mp4' : 'Assets/win.mp4';
  playCinematic(vid,()=>showOv('ovWin'));
}

function goNextLevel(){
  showOv(null); const next=G.level+1;
  playCinematic('Assets/cinematica'+next+'.mp4',()=>{
    showScreen('gameScreen');
    announceLevel('Nivel '+next,()=>{ cancelAnimationFrame(G.raf); initLevel(next,true); G.lastT=performance.now(); loop(G.lastT); });
  });
}
function restartFull(){
  showOv(null);cancelAnimationFrame(G.raf);
  playCinematic('Assets/cinematica1.mp4',()=>{ showScreen('gameScreen'); initLevel(1,false); G.lastT=performance.now(); announceLevel('Nivel 1',()=>loop(G.lastT)); });
}
function goMenu(){ 
  document.body.style.backgroundImage = ""; 
  let hint = document.getElementById('pauseHintTxt');
  if (hint) hint.style.display = 'none';
  showOv(null);cancelAnimationFrame(G.raf);G.running=false;stopZMusic();showScreen('menuScreen'); 
}

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='gameScreen') {
    resizeCanvas();
  } else {
    if (document.getElementById('dvdBoss')) document.getElementById('dvdBoss').style.display = 'none';
    if (document.getElementById('dvdArm')) document.getElementById('dvdArm').style.display = 'none';
  }
}

function startGame(){
  showOv(null);
  playCinematic('Assets/cinematica1.mp4',()=>{
    showScreen('gameScreen'); resizeCanvas(); initLevel(1,false);
    G.lastT=performance.now(); announceLevel('Nivel 1',()=>loop(G.lastT));
  });
}

window.startReno = function(){
  showOv(null);
  showScreen('gameScreen'); resizeCanvas();
  initLevel('reno',false);
  
  bgMusicZ.pause(); bgMusicZ.currentTime = 0;
  bgMusicReno.currentTime = 0;
  let pZ = bgMusicReno.play();
  if (pZ !== undefined && pZ.catch) pZ.catch(e=>console.log('Autoplay blocked:', e));
  
  G.lastT=performance.now(); 
  announceLevel('Atrapa al Reno',()=>loop(G.lastT));
}

function startSecretMobile() {
  showOv(null);
  playCinematic('Assets/secreto.mp4', () => {
    showScreen('gameScreen'); resizeCanvas();
    triggerSecretLevel('body2');
  });
}

function resizeCanvas(){
  if(!document.getElementById('gameScreen').classList.contains('active')) return;
  const maxW=window.innerWidth-32,maxH=window.innerHeight-75;
  const scale=Math.min(maxW/(COLS*CELL),maxH/(ROWS*CELL),1.5);
  canvas.style.width=(COLS*CELL*scale)+'px'; canvas.style.height=(ROWS*CELL*scale)+'px';
}
window.addEventListener('resize',resizeCanvas);

// ════════════════════════════════════════════
//  ARRANQUE — cargar sprites primero
// ════════════════════════════════════════════
selectChar('javiera');
setMode('1p');

// Mostrar mensaje de carga mientras se cargan los sprites
document.getElementById('menuScreen').style.opacity = '0.4';
document.getElementById('menuScreen').style.pointerEvents = 'none';

loadAllSprites(() => {
  document.getElementById('menuScreen').style.opacity = '';
  document.getElementById('menuScreen').style.pointerEvents = '';
  console.log('Sprites listos.');
});
