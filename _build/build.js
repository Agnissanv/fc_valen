// Génère les pages HTML du site FC Valen : node _build/build.js
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..');
const BASE = 'https://agnissanv.github.io/fc_valen/';

const I = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.600-1.500h1.700V4.400c-.3 0-1.300-.1-2.400-.1-2.400 0-4 1.400-4 4.100v2.400H7.700V14h2.700v8z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.800 3h3l-6.500 7.500L22 21h-6l-4.700-6.100L5.900 21h-3l7-8L2.400 3h6.100l4.300 5.600zm-1 16.200h1.700L7.600 4.700H5.800z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.500" cy="6.500" r="1" fill="currentColor"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm5.300 14.200c-.2.600-1.300 1.200-1.800 1.200-.5.100-1 .2-3.300-.7-2.800-1.200-4.600-4-4.700-4.200-.1-.2-1.100-1.500-1.100-2.800s.7-2 1-2.300c.2-.3.500-.3.700-.3h.5c.2 0 .4 0 .6.500l.8 2c.1.200.1.400 0 .5l-.4.600c-.1.200-.3.300-.1.600.2.300.8 1.300 1.700 2.100 1.100 1 2.100 1.300 2.400 1.500.3.100.4.100.6-.1l.8-1c.2-.3.400-.2.600-.1l1.900.9c.3.100.5.200.5.300.1.200.1.800-.1 1.400z"/></svg>',
  sil: '<svg class="sil" viewBox="0 0 100 130" aria-hidden="true"><circle cx="50" cy="32" r="22"/><path d="M8 130c0-34 18-58 42-58s42 24 42 58z"/></svg>',
};

const nav = [['index.html', 'Accueil'], ['equipe.html', 'Équipe'], ['galerie.html', 'Galerie'], ['resultats.html', 'Résultats'], ['contact.html', 'Contact']];

function head({ title, desc, page, img = 'asset/web/stade-foule.webp', preload = '' }) {
  const t = `FC Valen · ${title}`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t}</title>
<meta name="description" content="${desc}">
<meta name="keywords" content="FC Valen, football, Côte d'Ivoire, Abidjan, Stade Valen, résultats, équipe">
<meta name="author" content="FC Valen">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0A0A0C">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="FC Valen">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${BASE}${img}">
<meta property="og:url" content="${BASE}${page}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${BASE}${img}">
<link rel="icon" type="image/svg+xml" href="asset/img/logo.svg">
<link rel="apple-touch-icon" href="asset/img/logo.png">
<link rel="preload" href="styles/fonts/bebas-neue-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="styles/fonts/space-grotesk-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
${preload}<link rel="stylesheet" href="styles/style.css">
<script>document.documentElement.className+=' js'</script>
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
<div id="progress" aria-hidden="true"></div>
<div class="intro" aria-hidden="true"><svg viewBox="0 0 200 200"><path d="M30 28h140v78c0 42-28 68-70 88-42-20-70-46-70-88z"/><path class="v" d="M62 70l38 62 38-62"/></svg></div>
<div class="wipe" aria-hidden="true"></div>
`;
}
function header(cur) {
  const links = nav.map(([h, l]) => `<li><a href="${h}"${h === cur ? ' aria-current="page"' : ''}>${l}</a></li>`).join('');
  return `<header class="site"><div class="hbar">
<a class="logo" href="index.html" aria-label="FC Valen, accueil"><img src="asset/img/logo.svg" alt="" width="44" height="44"><b>FC VALEN</b></a>
<nav class="nav" id="nav" aria-label="Navigation principale"><ul>${links}</ul></nav>
<a class="hcta" href="vente_maillots.html">Maillots</a>
<button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav"><i></i><i></i><i></i></button>
</div></header>
<main id="contenu">
`;
}
function footer() {
  return `</main>
<footer class="site"><div class="wrap">
<div class="fword" aria-hidden="true">FC VALEN</div>
<div class="fgrid">
<div><a class="logo" href="index.html" style="margin-bottom:14px"><img src="asset/img/logo.svg" alt="" width="44" height="44"><b>FC VALEN</b></a><p style="color:var(--text-muted);max-width:26em">L'excellence sportive au cœur de la ville. Stade Valen, Anoumabo, Abidjan.</p>
<div class="social"><a href="https://www.facebook.com/fcvalen" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${I.fb}</a><a href="https://www.twitter.com/fcvalen" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">${I.x}</a><a href="https://www.instagram.com/fcvalen" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${I.ig}</a><a href="https://www.whatsapp.com/fcvalen" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">${I.wa}</a></div></div>
<div><h2>Le club</h2><a href="equipe.html">Équipe</a><a href="galerie.html">Galerie</a><a href="resultats.html">Résultats</a><a href="vente_maillots.html">Maillots</a><a href="contact.html">Contact</a></div>
<div><h2>Informations</h2><a href="mentions.html">Mentions légales</a><a href="confidentialite.html">Politique de confidentialité</a><a href="mailto:contact@fcvalen.ci">contact@fcvalen.ci</a></div>
</div>
<div class="legal"><span>© 2026 — FC Valen. Tous droits réservés.</span><span>Propulsé par <a href="https://www.agnissanisaac.com" target="_blank" rel="noopener noreferrer">Code AZ</a></span></div>
</div></footer>
<button class="totop" type="button" aria-label="Retour en haut">${I.up}</button>
<script src="scriptes/main.js"></script>
</body>
</html>
`;
}
const phero = (big, h1, p) => `<section class="phero"><span class="big" aria-hidden="true">${big}</span><div class="wrap"><span class="eyebrow">FC Valen</span><h1>${h1}</h1><p>${p}</p></div></section>\n`;
const pages = {};

// ================= données =================
const players = [
  ['Gardiens', 'g', [
    ["Marc-Arthur N'Guessan", 'Gardien', "Côte d'Ivoire", 1, 'j-nguessan'], ['Moussa Diallo', 'Gardien', 'Mali', 16, 'j-diallo'], ['Sylvain Koffi', 'Gardien', "Côte d'Ivoire", 30, 'j-koffi']]],
  ['Défenseurs', 'd', [
    ['Bakary Diomandé', 'Défenseur central', "Côte d'Ivoire", 4, 'j-diomande'], ['Ibrahim Bamba', 'Défenseur central', "Côte d'Ivoire", 5, 'j-bamba'], ['Issoufou Kaboré', 'Défenseur central', 'Burkina Faso', 12, 'j-kabore'], ['Christian Gnahoré', 'Défenseur central', "Côte d'Ivoire", 22, 'j-gnahore'],
    ['Losseni Koné', 'Latéral droit', "Côte d'Ivoire", 2, 'j-kone'], ['Junior Yao Koff', 'Latéral droit', "Côte d'Ivoire", 13, 'j-yao-koff'], ['Lassina Coulibaly', 'Latéral gauche', "Côte d'Ivoire", 3, ''], ['Samuel Mensah', 'Latéral gauche', 'Ghana', 17, '']]],
  ['Milieux', 'm', [
    ['Kader Touré', 'Milieu défensif et central', "Côte d'Ivoire", 6, ''], ['Aboubacar Fofana', 'Milieu défensif et central', "Côte d'Ivoire", 18, ''], ['Oumarou Diarra', 'Milieu défensif et central', 'Mali', 14, ''], ["Franck-Arnaud N'Dri", 'Milieu défensif et central', "Côte d'Ivoire", 20, ''],
    ['Wilfried Zadi', 'Milieu offensif et meneur', "Côte d'Ivoire", 10, ''], ['Stéphane Gbaï', 'Milieu offensif et meneur', "Côte d'Ivoire", 8, ''], ['Blessing Okafor', 'Milieu offensif et meneur', 'Nigeria', 28, ''], ['Jean-Eudes Seri', 'Milieu offensif et meneur', "Côte d'Ivoire", 26, '']]],
  ['Attaquants', 'a', [
    ['Ange-Emmanuel Akré', 'Ailier', "Côte d'Ivoire", 7, ''], ['Lassane Traoré', 'Ailier', 'Burkina Faso', 11, ''], ['Landry Boti Bi', 'Ailier', "Côte d'Ivoire", 21, ''], ['Ulrich Konan', 'Avant-centre', "Côte d'Ivoire", 9, ''], ['Amadou Sylla', 'Avant-centre', "Côte d'Ivoire", 19, ''], ['Rodrigue Doumbia', 'Avant-centre', "Côte d'Ivoire", 23, '']]],
];
const staff = [['Yapo Frédéric', 'Entraîneur principal', 's-principal'], ['Allé Kouakou', 'Entraîneur adjoint', 's-adjoint'], ['Thomas Lefèvre', 'Préparateur physique', 's-physique'], ['Sissoko Aboubakar', 'Entraîneur des gardiens', 's-gardiens']];
const all = players.flatMap(g => g[2]);
const pos = { 1: [50, 91], 2: [86, 72], 4: [62, 77], 5: [38, 77], 3: [14, 72], 6: [50, 57], 8: [26, 44], 10: [74, 44], 7: [16, 20], 11: [84, 20], 9: [50, 13] };
const squad = Object.keys(pos).map(n => { const p = all.find(x => x[3] == n); return { n: +n, name: p[0], poste: p[1], pays: p[2], img: p[4], x: pos[n][0], y: pos[n][1] }; });
const last = [['15/05/2025', 'AS Valois', 3, 0, 'Championnat'], ['08/05/2025', 'FC Rivage', 1, 1, 'Championnat'], ['01/05/2025', 'Étoile Sportive', 2, 1, 'Coupe'], ['24/04/2025', 'Olympique Nord', 0, 2, 'Championnat'], ['17/04/2025', 'AS Côte Ouest', 4, 0, 'Championnat'], ['10/04/2025', 'US Centre', 0, 0, 'Coupe']];
const upcoming = [['22/05/2025', 'Adversaire à confirmer', 'Domicile · Stade Valen', 'Championnat'], ['29/05/2025', 'AS Valenciennes', 'Extérieur', 'Championnat'], ['05/06/2025', 'Adversaire à confirmer', 'Domicile · Stade Valen', 'Coupe · Quart de finale']];
const rank = [['ASEC Mimosas', 22, 16, 4, 2, 48, 15, 52], ['FC Valen', 22, 14, 5, 3, 39, 18, 47], ['AFAD Djékanou', 22, 12, 6, 4, 32, 20, 42], ['San Pedro FC', 22, 11, 5, 6, 30, 25, 38], ['Racing Club Abidjan', 22, 10, 7, 5, 27, 22, 37], ["Stade d'Abidjan", 22, 9, 6, 7, 28, 27, 33], ['SOA', 22, 8, 7, 7, 24, 23, 31], ['Bouaké FC', 22, 7, 8, 7, 22, 24, 29], ['LYS Sassandra', 22, 6, 6, 10, 20, 30, 24], ['ES Bafing', 22, 5, 5, 12, 19, 34, 20], ['CO Korhogo', 22, 3, 6, 13, 14, 35, 15], ['USC Bassam', 22, 4, 3, 15, 16, 39, 15], ['WAC San Pedro', 22, 3, 5, 14, 12, 38, 14], ['RC Abengourou', 22, 3, 5, 14, 10, 41, 14]];
const res = m => m[2] > m[3] ? 'w' : m[2] < m[3] ? 'l' : 'd';
const tick = last.map(m => `<li><i class="${res(m)}">${{ w: 'V', d: 'N', l: 'D' }[res(m)]}</i>FC VALEN ${m[2]}–${m[3]} ${m[1].toUpperCase()}</li>`).join('');
const pal = [['Ligue des champions (CAF)', 6, '2005, 2010, 2013, 2015, 2018, 2022'], ["Champion de Côte d'Ivoire", 11, '1999, 2001, 2004, 2006, 2008, 2011, 2014, 2016, 2019, 2021, 2024'], ["Super Coupe d'Afrique", 4, '2006, 2011, 2014, 2019'], ['Coupe nationale', 8, '2000, 2002, 2005, 2007, 2010, 2013, 2017, 2020']];
const pitchLines = '<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice"><rect x="60" y="40" width="1080" height="620"/><path d="M600 40v620"/><circle cx="600" cy="350" r="92"/><rect x="60" y="190" width="170" height="320"/><rect x="970" y="190" width="170" height="320"/><rect x="60" y="270" width="64" height="160"/><rect x="1076" y="270" width="64" height="160"/></svg>';

// ================= ACCUEIL =================
pages['index.html'] = head({ title: 'Accueil', desc: "FC Valen, votre club de football à Abidjan : actualités, équipe, résultats, maillots 2025-2026 et palmarès.", page: 'index.html', preload: '<link rel="preload" href="asset/web/stade-foule.webp" as="image" type="image/webp">\n' })
+ header('index.html') + `
<section class="hero">
<div class="bg" role="img" aria-label="Le Stade Valen de nuit, sous les projecteurs"></div><div class="beam b1"></div><div class="beam b2"></div><div class="grain"></div>
<div class="giant" aria-hidden="true">VALEN</div>
<div class="wrap hero-in">
<div><span class="eyebrow">Anoumabo · Abidjan · Depuis 1999</span>
<h1><span class="l"><span>L'excellence</span></span><span class="l"><span>sportive <em class="g" style="font-style:normal">au cœur</em></span></span><span class="l"><span>de la ville.</span></span></h1>
<p class="lead">Découvrez notre passion, nos valeurs et notre équipe. Six fois championne d'Afrique, le FC Valen forme la jeunesse et fait vibrer 50 000 supporters.</p>
<div class="actions"><a class="btn" href="equipe.html">Découvrir l'équipe ${I.arrow}</a><a class="btn ghost" href="resultats.html">Résultats</a></div></div>
<aside class="board" aria-label="Prochain match"><div class="k">Prochain match · Championnat</div><div class="vs">FC Valen<small>À domicile · Stade Valen</small></div>
<div class="count" id="countdown" role="timer" aria-live="off"><div><b data-u="j">00</b><span>jours</span></div><div><b data-u="h">00</b><span>heures</span></div><div><b data-u="m">00</b><span>min</span></div><div><b data-u="s">00</b><span>sec</span></div></div></aside>
</div></section>
<div class="ticker" aria-label="Derniers résultats"><div class="track"><ul>${tick}</ul><ul aria-hidden="true">${tick}</ul><ul aria-hidden="true">${tick}</ul><ul aria-hidden="true">${tick}</ul></div></div>

<section class="s"><div class="lines">${pitchLines}</div><div class="wrap">
<span class="eyebrow">Le club</span>
<p class="manifesto">${'Un club né dans le quartier, devenu <b class="hl">six fois champion d\'Afrique</b>. Des jeunes formés ici, un stade qui ne dort jamais, et une seule ambition : <b class="hl">faire de Valen le porte-drapeau du football africain.</b>'.split(/(<b class="hl">.*?<\/b>)/).map(seg => seg.startsWith('<b') ? seg.replace(/<b class="hl">(.*?)<\/b>/, (_, t) => t.split(' ').map(w => `<span class="hl">${w}</span>`).join(' ')) : seg.split(' ').filter(Boolean).map(w => `<span>${w}</span>`).join(' ')).join(' ')}</p>
<div class="stats">
<div class="stat rv"><b data-count="29">0</b><span>Trophées majeurs</span><small>Toutes compétitions confondues</small></div>
<div class="stat filled rv"><b data-count="600+">0</b><span>Jeunes formés</span><small>L'avenir du football ivoirien</small></div>
<div class="stat rv"><b data-count="50K">0</b><span>Supporters</span><small>Une communauté engagée</small></div>
</div></div></section>

<section class="s deep notch"><div class="wrap">
<span class="eyebrow rv">À la une</span>
<article class="feature rv"><div class="pic"><img src="asset/web/actu-mbappe.webp" width="735" height="490" alt="Conférence de presse, illustration de l'article" loading="lazy"></div>
<div class="tx"><span class="tag">Mercato · Fiction</span><h3>Kylian Mbappé au FC Valen : la rumeur qui enflamme Marcory et le monde entier !!!</h3>
<p>Séisme sur la planète foot : les récentes tractations à Madrid marquent un tournant majeur pour le FC Valen. Alors que le mercato bat son plein, le club affirme que Mbappé pourrait…</p>
<a class="more" href="article1.html">Lire la suite ${I.arrow}</a><span class="date">À l'instant</span></div></article>
</div></section>

<section class="s"><div class="wrap">
<div class="kits" id="kit" style="--kc:#00E676"><div class="kitstage rv left"><div class="disc"></div><div class="ring"></div><img src="asset/web/maillot-domicile.webp" width="800" height="800" alt="Maillot domicile"></div>
<div class="rv"><span class="eyebrow">Saison 2025-2026</span><h2 class="kitname" id="kitname">Domicile</h2><p id="kitdesc" style="color:var(--text-muted);font-size:1.1rem;margin:0">Vert électrique / Noir</p>
<div class="kitlist" role="group" aria-label="Choisir un maillot">
<button type="button" aria-pressed="true" data-name="Domicile" data-desc="Vert électrique / Noir" data-color="#00E676" data-img="asset/web/maillot-domicile.webp"><i style="background:#00E676"></i><span><b>Domicile</b><small>Vert électrique / Noir</small></span></button>
<button type="button" aria-pressed="false" data-name="Extérieur" data-desc="Blanc / Noir" data-color="#E8EAF0" data-img="asset/web/maillot-exterieur.webp"><i style="background:#fff"></i><span><b>Extérieur</b><small>Blanc / Noir</small></span></button>
<button type="button" aria-pressed="false" data-name="Third" data-desc="Noir / Vert fluo" data-color="#14351f" data-img="asset/web/maillot-third.webp"><i style="background:#111;border-color:#00E676"></i><span><b>Third</b><small>Noir / Vert fluo</small></span></button></div>
<a class="btn" href="vente_maillots.html">Précommander ${I.arrow}</a></div></div>
</div></section>

<section class="s night notch" style="padding-bottom:calc(var(--notch) + 90px)"><div class="lines">${pitchLines}</div><div class="wrap">
<span class="eyebrow rv">Palmarès</span><h2 class="stitle rv">Vingt-neuf fois <span class="g">sacré</span></h2>
<div class="pal">${pal.map((p, i) => `<div class="trophy rv" style="--d:${i * .1}s"><span class="n" data-count="${p[1]}">0</span><h3>${p[0]}</h3><div class="years">${p[2].split(', ').map(y => `<span>${y}</span>`).join('')}</div></div>`).join('')}</div>
</div></section>

<section class="arena" style="margin-top:calc(var(--notch) * -1)"><div class="bg" role="img" aria-label="Le Stade Valen vu de l'intérieur"></div><div class="wrap" style="padding-bottom:70px"><span class="eyebrow">Notre stade</span><h2 class="stitle" style="margin:0">Stade Valen</h2>
<div class="facts"><div><b data-count="70000">0</b><span>places</span></div><div><b>Anoumabo</b><span>Marcory, Abidjan</span></div><div><b>Notre force</b><span>Une seule famille</span></div></div></div></section>

<section class="s"><div class="wrap">
<div style="display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap;margin-bottom:34px"><h2 class="stitle rv" style="margin:0">Nos <span class="g">actualités</span></h2></div>
<div class="news">
<article class="ncard rv"><div class="im"><img src="asset/web/president.webp" width="600" height="600" alt="Le président du FC Valen" loading="lazy"></div><div class="b"><span class="tag" style="align-self:flex-start">Club</span><p>Le président du FC Valen vient de prendre une décision qui pourrait changer radicalement l'avenir de…</p><span class="more">Bientôt en ligne</span></div></article>
<article class="ncard rv"><div class="im"><img src="asset/web/s-principal.webp" width="640" height="800" alt="L'entraîneur principal" loading="lazy" style="object-position:center 20%"></div><div class="b"><span class="tag" style="align-self:flex-start">Staff</span><p>Des nouvelles sur l'arrivée du nouvel entraîneur du club…</p><span class="more">Bientôt en ligne</span></div></article>
<article class="ncard rv"><div class="im"><img src="asset/web/maillot-third.webp" width="800" height="800" alt="Le maillot third" loading="lazy"></div><div class="b"><span class="tag" style="align-self:flex-start">Boutique</span><p>Le troisième maillot de la saison est disponible dès maintenant ! C'est l'un des…</p><a class="more" href="vente_maillots.html">Voir les maillots ${I.arrow}</a></div></article>
</div></div></section>

<section class="s deep notch-t cta"><div class="wrap"><span class="eyebrow" style="justify-content:center">Rejoignez-nous</span><h2 class="stitle rv">Une question ? <span class="g">Un partenariat ?</span></h2><p class="sintro rv" style="margin:0 auto 30px">Écrivez-nous : supporters, sponsors, futurs joueurs, nous répondons à tout le monde.</p><a class="btn rv" href="contact.html">Nous écrire ${I.arrow}</a></div></section>
` + footer();

// ================= ÉQUIPE =================
const card = p => `<article class="pl ${p[4] ? '' : 'nopic'}">${p[4] ? `<img src="asset/web/${p[4]}.webp" width="640" height="640" alt="Portrait de ${p[0]}" loading="lazy">` : I.sil}<span class="num" aria-hidden="true">${p[3]}</span><div class="info"><h3>${p[0]}</h3><div class="po">${p[1]}</div><div class="pa">${p[2]}</div></div></article>`;
pages['equipe.html'] = head({ title: 'Équipe', desc: "L'effectif pro et le staff technique du FC Valen : gardiens, défenseurs, milieux, attaquants. Fiches joueurs et composition sur le terrain.", page: 'equipe.html' })
+ header('equipe.html') + phero('VALEN', 'Notre équipe', "Les joueurs et le staff qui font la fierté du FC Valen. Parcourez les fiches, ou cliquez sur le terrain pour composer l'équipe type.") + `
<section class="s" style="padding-top:20px"><div class="wrap" id="squad">
<div class="tools"><div class="chips" id="filters" role="group" aria-label="Filtrer par ligne"><button type="button" data-f="all" aria-pressed="true">Tous</button>${players.map(g => `<button type="button" data-f="${g[1]}" aria-pressed="false">${g[0]}</button>`).join('')}</div>
<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><span id="sq-count" style="color:var(--text-muted)" role="status" aria-live="polite">${all.length + staff.length} fiches</span><div class="seg" role="group" aria-label="Choisir la vue"><button type="button" data-v="grid" aria-pressed="true">Fiches</button><button type="button" data-v="pitch" aria-pressed="false">Terrain</button></div></div></div>
<div id="gridview">
${players.map(g => `<div class="group" data-g="${g[1]}"><h2 class="group-title">${g[0]} <span>${g[2].length}</span></h2><div class="players">${g[2].map(card).join('')}</div></div>`).join('\n')}
</div>
<div id="pitchview" class="pitchview" hidden>
<div><div class="pitch" id="pitch"><svg class="lin" viewBox="0 0 68 100" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="66" height="98"/><path d="M1 50h66"/><circle cx="34" cy="50" r="9"/><rect x="14" y="1" width="40" height="16"/><rect x="24" y="1" width="20" height="6"/><rect x="14" y="83" width="40" height="16"/><rect x="24" y="93" width="20" height="6"/></svg></div><p style="text-align:center;color:var(--text-muted);font-size:.9rem;margin-top:12px">Composition type en 4-3-3. Cliquez sur un joueur.</p></div>
<aside class="sheet" id="sheet" aria-live="polite"><span class="bignum">11</span><h3>Choisissez un joueur</h3><span class="po">Composition type</span><p style="margin:10px 0 0;color:#A0A5B5">Sélectionnez un numéro sur le terrain pour voir la fiche.</p></aside>
</div>
<div class="group" data-g="s" style="margin-top:20px"><h2 class="group-title">Staff technique <span>${staff.length}</span></h2><div class="staffg">
${staff.map(s => `<article class="pl" style="aspect-ratio:3/4"><img src="asset/web/${s[2]}.webp" width="640" height="800" alt="${s[0]}, ${s[1].toLowerCase()}" loading="lazy" style="filter:grayscale(.6)"><div class="info"><h3>${s[0]}</h3><div class="po">${s[1]}</div></div></article>`).join('')}
</div></div>
</div></section>
<script>window.SQUAD=${JSON.stringify(squad)};</script>
` + footer();
pages['equipe.html'] = pages['equipe.html'].replace('<div class="chips" id="filters" role="group" aria-label="Filtrer par ligne">', '<div class="chips" id="filters" role="group" aria-label="Filtrer par ligne">').replace(/<button type="button" data-f="s"[^>]*>.*?<\/button>/, '');
pages['equipe.html'] = pages['equipe.html'].replace('<button type="button" data-f="a" aria-pressed="false">Attaquants</button>', '<button type="button" data-f="a" aria-pressed="false">Attaquants</button><button type="button" data-f="s" aria-pressed="false">Staff</button>');

// ================= RÉSULTATS =================
pages['resultats.html'] = head({ title: 'Résultats', desc: 'Résultats, prochaines rencontres et classement du championnat, saison 2024-2025 : le FC Valen deuxième avec 47 points.', page: 'resultats.html', img: 'asset/web/action.webp' })
+ header('resultats.html') + phero('SCORE', 'Résultats', 'Suivez les performances du FC Valen, saison 2024-2025 : derniers matchs, prochaines rencontres et classement du championnat.') + `
<section class="s" style="padding-top:20px"><div class="wrap">
<div class="formrow" aria-label="Forme du moment"><b>Forme</b>${last.map((m, i) => `<span class="fc ${res(m)}" style="animation-delay:${i * .1}s" title="${m[1]}">${{ w: 'V', d: 'N', l: 'D' }[res(m)]}</span>`).join('')}<span style="color:var(--text-muted);font-size:.9rem;margin-left:10px">V victoire · N nul · D défaite</span></div>
<h2 class="stitle rv" style="font-size:clamp(2.6rem,6vw,4.6rem)">Derniers <span class="g">matchs</span></h2>
<div class="matches">${last.map((m, i) => `<div class="mrow ${res(m)} rv" style="--d:${i * .05}s"><span class="dt">${m[0]}</span><span class="t1">FC Valen</span><span class="sc">${m[2]} – ${m[3]}</span><span class="t2">${m[1]}</span><span class="cp">${m[4]}</span></div>`).join('')}</div>
<p class="upd">Score affiché du point de vue du FC Valen (buts du FC Valen en premier).</p>
</div></section>
<section class="s deep notch" style="padding-bottom:calc(var(--notch) + 80px)"><div class="wrap">
<h2 class="stitle rv" style="font-size:clamp(2.6rem,6vw,4.6rem)">Prochaines <span class="g">rencontres</span></h2>
<div class="next">${upcoming.map((u, i) => { const [d, mth] = [u[0].slice(0, 2), ['', 'Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin'][+u[0].slice(3, 5)]]; return `<div class="ncm rv" style="--d:${i * .1}s"><span class="bdg">${u[3].split(' ·')[0]}</span><div class="d">${d}<small>${mth} ${u[0].slice(6)}</small></div><h3>${u[1]}</h3><p>${u[2]}${u[3].includes('Quart') ? ' · Quart de finale' : ''}</p></div>`; }).join('')}</div>
</div></section>
<section class="s" style="margin-top:calc(var(--notch) * -1);padding-top:calc(var(--notch) + 60px)"><div class="wrap rank-wrap">
<h2 class="stitle rv" style="font-size:clamp(2.6rem,6vw,4.6rem)">Classement du <span class="g">championnat</span></h2>
<div class="tablewrap rv"><table class="rank"><caption class="vh">Classement du championnat</caption><thead><tr><th scope="col">Rang</th><th scope="col">Équipe</th><th scope="col">J</th><th scope="col">G</th><th scope="col">N</th><th scope="col">P</th><th scope="col">BP</th><th scope="col">BC</th><th scope="col">Diff</th><th scope="col">Points</th></tr></thead><tbody>
${rank.map((r, i) => `<tr${r[0] === 'FC Valen' ? ' class="me"' : ''}><td class="r">${i + 1}</td><td class="tm">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${r[6]}</td><td>${r[5] - r[6] > 0 ? '+' : ''}${r[5] - r[6]}</td><td class="pt"><div class="ptbar"><i data-w="${(r[7] / 52).toFixed(3)}"></i><b>${r[7]}</b></div></td></tr>`).join('')}
</tbody></table></div>
<p class="upd">Dernière mise à jour : 22 mai 2025 — FC Valen leader invaincu à domicile.</p>
</div></section>
` + footer();

// ================= GALERIE =================
const gal = [['action', 'Action décisive', 'Action_decisive'], ['stade', 'Stade Valen', 'Stade_Valen'], ['stade-foule', '12ème homme', '12eme_homme'], ['entrainement', "Séance d'entraînement", ''], ['maillot-domicile', 'Nouveau maillot domicile', ''], ['j-diomande', 'Célébration après but', ''], ['trophee', 'Palmarès 2024', ''], ['academie', 'Académie FC Valen', '']];
pages['galerie.html'] = head({ title: 'Galerie', desc: "Les moments forts du FC Valen en photos : le stade, les supporters, les entraînements, les trophées et l'académie.", page: 'galerie.html', img: 'asset/web/action.webp' })
+ header('galerie.html') + phero('PHOTOS', 'Galerie', 'Les moments forts du FC Valen en images. Cliquez sur une photo pour la voir en grand.') + `
<section class="s" style="padding-top:20px"><div class="wrap"><div class="mason">
${gal.map((g, i) => `<button type="button" class="gi rv" style="--d:${(i % 3) * .1}s" data-cap="${g[1]}" aria-label="Agrandir : ${g[1]}"><img src="asset/web/${g[0]}.webp" alt="${g[1]}" loading="lazy" width="900" height="700"><span class="cap">${g[1]}</span></button>`).join('')}
</div></div></section>
` + footer();

// ================= CONTACT =================
pages['contact.html'] = head({ title: 'Contact', desc: "Contactez le FC Valen pour toute question, partenariat ou simplement pour nous encourager. Coordonnées et formulaire de contact.", page: 'contact.html' })
+ header('contact.html') + phero('ÉCRIVEZ', 'Contact', 'Une question, un partenariat ou simplement pour nous encourager ? Écrivez-nous !') + `
<section class="s" style="padding-top:20px"><div class="wrap cgrid">
<div class="rv"><h2 style="font-size:clamp(2.4rem,5vw,4rem)">Envoyer un <span class="g">message</span></h2>
<form id="contact-form" class="form" novalidate aria-label="Formulaire de contact">
<div class="fld"><input id="nom" name="nom" type="text" placeholder=" " autocomplete="name" required><label for="nom">Nom complet *</label><p class="err">Indiquez votre nom.</p></div>
<div class="fld"><input id="email" name="email" type="email" placeholder=" " autocomplete="email" required><label for="email">Email *</label><p class="err">Indiquez une adresse e-mail valide.</p></div>
<div class="fld"><input id="sujet" name="sujet" type="text" placeholder=" "><label for="sujet">Sujet (optionnel)</label></div>
<div class="fld"><textarea id="message" name="message" rows="5" placeholder=" " required></textarea><label for="message">Message *</label><p class="err">Écrivez votre message.</p></div>
<div><button class="btn" type="submit">Envoyer ${I.arrow}</button></div>
<p class="note" id="form-ok" role="status" hidden>Votre application de messagerie s'ouvre avec votre message prêt à partir. Vos données ne sont utilisées que pour vous répondre (<a href="confidentialite.html" style="color:var(--primary-green)">confidentialité</a>).</p>
</form></div>
<aside class="rv"><div class="infocard"><h2>Nous trouver</h2><dl>
<dt>Le club</dt><dd>FC Valen<br>Stade Valen, Anoumabo<br>Abidjan · 70 000 places</dd>
<dt>E-mail</dt><dd><a href="mailto:contact@fcvalen.ci">contact@fcvalen.ci</a></dd>
<dt>Téléphone</dt><dd><a href="tel:+2250769398708">+225 07 69 39 87 08</a></dd>
<dt>Billetterie</dt><dd><a href="mailto:billetterie@fcvalen.ci">billetterie@fcvalen.ci</a></dd></dl></div>
<div class="stadepic"><img src="asset/web/stade-tribunes.webp" width="1400" height="933" alt="Le Stade Valen" loading="lazy"></div></aside>
</div></section>
` + footer();

// ================= MAILLOTS =================
pages['vente_maillots.html'] = head({ title: 'Maillots', desc: 'Les maillots 2025-2026 du FC Valen : domicile, extérieur et third. Rupture de stock : laissez votre e-mail pour être prévenu du retour.', page: 'vente_maillots.html', img: 'asset/web/maillot-domicile.webp' })
+ header('vente_maillots.html') + phero('SAISON', 'Maillots', 'Collection 2025-2026 : domicile, extérieur et third. Les maillots sont actuellement en rupture de stock.') + `
<section class="s" style="padding-top:20px"><div class="wrap">
<div class="shop">${[['Domicile', 'Vert électrique / Noir', 'maillot-domicile'], ['Extérieur', 'Blanc / Noir', 'maillot-exterieur'], ['Third', 'Noir / Vert fluo', 'maillot-third']].map((m, i) => `<article class="shopc rv" style="--d:${i * .1}s"><span class="soldout">Rupture</span><img src="asset/web/${m[2]}.webp" width="800" height="800" alt="Maillot ${m[0].toLowerCase()}" loading="lazy"><h3>${m[0]}</h3><p style="color:var(--text-muted);margin:0">${m[1]}</p></article>`).join('')}</div>
<div class="notify" style="margin-top:70px"><h2 class="stitle rv" style="font-size:clamp(2.6rem,6vw,4.6rem)">Prévenez-<span class="g">moi</span></h2><p class="sintro rv">Laissez votre adresse : le club vous prévient dès le retour en stock.</p>
<form id="notify-form" class="form rv" novalidate aria-label="Être prévenu du retour en stock"><div class="fld"><input id="n-email" type="email" placeholder=" " autocomplete="email" required><label for="n-email">Votre e-mail *</label><p class="err">Indiquez une adresse e-mail valide.</p></div><div><button class="btn" type="submit">Me prévenir ${I.arrow}</button></div><p class="note" id="notify-ok" role="status" hidden>Votre messagerie s'ouvre avec la demande prête à partir.</p></form></div>
</div></section>
` + footer();

// ================= ARTICLE =================
pages['article1.html'] = head({ title: 'Kylian Mbappé au FC Valen', desc: 'Article de fiction : la rumeur Mbappé au FC Valen enflamme Marcory.', page: 'article1.html', img: 'asset/web/actu-mbappe.webp' })
+ header('') + `
<section class="phero" style="padding-bottom:50px"><div class="wrap" style="max-width:1000px"><span class="eyebrow">Mercato · Fiction</span><h1 style="font-size:clamp(2.6rem,7vw,6rem);line-height:.92">Kylian Mbappé au FC Valen : la rumeur qui enflamme Marcory et le monde entier !!!</h1><p>Publié à l'instant</p></div></section>
<div class="artimg"><img src="asset/web/actu-mbappe.webp" width="735" height="490" alt="Conférence de presse, illustration de l'article"></div>
<section class="s" style="padding-top:0"><div class="wrap"><article class="art">
<p class="fiction"><strong>Article de fiction.</strong> Ce texte est humoristique et imaginaire : les faits, déclarations et personnes réelles qui y sont évoquées n'ont aucun lien avec la réalité.</p>
<p class="lead">Séisme sur la planète foot : les récentes tractations à Madrid marquent un tournant majeur pour le FC Valen. Alors que le mercato bat son plein, le club ivoirien aurait discrètement approché l'entourage du capitaine des Bleus.</p>
<p>Si l'information reste encore à confirmer, elle a déjà enflammé les réseaux sociaux et les travées du Stade Valen. Derrière cette manœuvre audacieuse, on retrouve l'empreinte tactique du coach Yapo : l'architecte du renouveau valenois aurait personnellement mené les négociations, convaincu que son projet de jeu est le seul capable de séduire une superstar de cette envergure.</p>
<p>Selon nos confrères de France Football et Marcory Sport Infos, Kylian Mbappé, en fin de contrat avec le Real Madrid en 2026, chercherait un projet « hors norme, à la fois sportif et humain ». Et c'est précisément ce que le FC Valen, 6 fois champion d'Afrique, aurait su lui promettre : un statut de franchise player, des investissements colossaux dans un centre de formation ultramoderne, et un pont d'or avec les plus grandes marques ivoiriennes et internationales comme Adidas ou Puma ou même Sentimentale.</p>
<blockquote>Le FC Valen est désormais un club qui attire les plus grands.</blockquote>
<p>Interrogé en zone mixte, le président Agnissan Isaac a souri sans démentir : « Le FC Valen est désormais un club qui attire les plus grands. Nous ne commentons pas les rumeurs, mais notre ambition est de faire de notre club le porte-drapeau du football africain. » Une déclaration qui a immédiatement affolé la Toile.</p>
<h2>Un impact économique et médiatique gigantesque</h2>
<p>Sous l'impulsion du coach Yapo, qui ne cesse de clamer que le FC Valen doit viser plus haut que le titre continental, l'arrivée de Mbappé à Valen représenterait un transfert planétaire. Les droits TV de la Ligue ivoirienne exploseraient, le championnat deviendrait l'un des plus suivis d'Afrique. Les maillots floqués « Mbappé 10 » seraient précommandés par milliers. La ville d'Abidjan (Marcory-Anoumabo), où se situe le stade, serait promue destination foot internationale.</p>
<p>Certains sponsors, comme une célèbre marque de boisson énergisante et un opérateur télécoms, auraient déjà rehaussé leurs offres. Le FC Valen, qui réalise déjà des records d'affluence avec plus de 60 000 supporters par match, passerait dans une autre dimension : le stade pourra-t-il accueillir tous ces fans ?</p>
<h2>Les supporters en folie</h2>
<p>Devant le stade, des milliers de fans se sont rassemblés dès l'aube, scandant « Valen, Valen, signe Mbappé ! ». Les ventes d'abonnements ont bondi de 200 % en 48 heures. Un groupe de supporters a même lancé une cagnotte participative pour « aider le club à boucler le salaire de la superstar ». En seulement 12 heures, près de 150 millions de FCFA ont été récoltés.</p>
<p>Reste une question : Mbappé accepterait-il de quitter l'Europe pour la Côte d'Ivoire ? Rien n'est moins sûr, mais le simple fait que le FC Valen ose rêver aussi grand prouve son irrésistible ascension. Affaire à suivre…</p>
<p style="margin-top:40px"><a class="more" href="index.html">${I.arrow.replace('<svg', '<svg style="transform:rotate(180deg)"')} Retour à l'accueil</a></p>
<p style="color:var(--text-muted);font-size:.85rem">Crédit photo : illustration libre de droit, composition FC Valen.</p>
</article></div></section>
` + footer();
// L'article d'origine citait des propos attribués à l'agent et à la mère du joueur : ces deux passages n'ont pas été repris.

// ================= LÉGAL =================
const legal = (title, sub, file, toc, body) => head({ title, desc: sub, page: file }) + header('') + phero('LÉGAL', title, sub) + `<section class="s" style="padding-top:10px"><div class="wrap legalgrid"><nav class="toc" aria-label="Sommaire">${toc.map(t => `<a href="#${t[0]}">${t[1]}</a>`).join('')}</nav><div class="prose">${body}</div></div></section>\n` + footer();
pages['mentions.html'] = legal('Mentions légales', 'Conformément aux articles 6-III et 19 de la loi n°2004-575 pour la confiance dans l\'économie numérique', 'mentions.html', [['editeur', 'Éditeur du site'], ['directeur', 'Directeur de publication'], ['hebergement', 'Hébergement'], ['pi', 'Propriété intellectuelle'], ['resp', 'Responsabilité'], ['droit', 'Droit applicable']],
`<h2 id="editeur">Éditeur du site</h2><p>FC Valen<br>Association loi 1901 (RNA : W123456789)<br>Stade Valen, Anoumabo, 70.000 places<br>Tél : +225 07 69 39 87 08<br>Email : <a href="mailto:contact@fcvalen.ci">contact@fcvalen.ci</a><br>SIRET : 123 456 789 00012</p>
<h2 id="directeur">Directeur de publication</h2><p>Agnissan Isaac, Président du FC Valen</p>
<h2 id="hebergement">Hébergement</h2><p>Code AZ<br>Marcory-Anoumabo, Abidjan, Côte d'Ivoire<br>(service Code AZ)</p>
<h2 id="pi">Propriété intellectuelle</h2><p>L'ensemble des éléments composant ce site (structure, textes, images, logo, vidéos, habillage graphique) est la propriété exclusive du FC Valen. Toute reproduction, représentation, modification ou exploitation partielle ou totale, par quelque procédé que ce soit, sans l'autorisation préalable écrite du FC Valen est interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.</p>
<h2 id="resp">Limitation de responsabilité</h2><p>Le FC Valen met tout en œuvre pour fournir des informations exactes et actualisées. Toutefois, des erreurs ou omissions peuvent survenir. Le club ne pourra être tenu responsable d'un dommage direct ou indirect lié à l'utilisation du site.</p>
<h2 id="droit">Droit applicable</h2><p>Les présentes mentions légales sont régies par le droit ivoirien. En cas de litige, les tribunaux ivoiriens seront seuls compétents.</p>`);
pages['confidentialite.html'] = legal('Confidentialité', 'Protection des données personnelles : RGPD', 'confidentialite.html', [['resp', 'Responsable'], ['donnees', 'Données collectées'], ['finalites', 'Finalités'], ['duree', 'Conservation'], ['droits', 'Vos droits'], ['heberg', 'Hébergement'], ['maj', 'Mises à jour']],
`<h2 id="resp">Responsable de traitement</h2><p>Le FC Valen, association loi 1901, dont le siège est au Stade Valen, Anoumabo, est responsable du traitement des données personnelles collectées sur ce site.</p>
<h2 id="donnees">Données collectées</h2><p>Nous collectons uniquement les informations que vous nous transmettez volontairement via le formulaire de contact :</p><ul><li>Nom et prénom</li><li>Adresse e-mail</li><li>Sujet (optionnel)</li><li>Contenu du message</li></ul><p>Aucune donnée sensible n'est collectée. Le site ne dépose pas de cookies publicitaires ou de traçage.</p>
<h2 id="finalites">Finalités du traitement</h2><p>Vos données sont utilisées exclusivement pour répondre à vos demandes d'information, gérer les relations avec les supporters et les partenaires, et améliorer nos services. Elles ne font l'objet d'aucune décision automatisée ou de profilage.</p>
<h2 id="duree">Destinataires et durée de conservation</h2><p>Les données sont accessibles uniquement aux membres habilités du FC Valen (secrétariat, communication). Elles sont conservées pendant une durée maximale de 3 ans après le dernier contact, puis supprimées.</p>
<h2 id="droits">Vos droits</h2><p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et à la portabilité de vos données. Pour exercer ces droits, adressez votre demande par e-mail à <a href="mailto:dpo@fcvalen.ci">dpo@fcvalen.ci</a>, ou par courrier à l'adresse du club, en joignant une copie de votre pièce d'identité.</p>
<h2 id="heberg">Hébergement des données</h2><p>Les données issues des formulaires sont transmises par e-mail et ne sont pas stockées dans une base de données locale. L'hébergeur du site (Code AZ) ne collecte que les traces techniques nécessaires au fonctionnement.</p>
<h2 id="maj">Modification de la politique</h2><p>La présente politique peut être mise à jour. La version en ligne fait foi. Dernière mise à jour : 26 mai 2025.</p>`);

for (const [f, html] of Object.entries(pages)) fs.writeFileSync(path.join(out, f), html.replace(/<\/span> <span>([.,!?])<\/span>/g, '</span><span>$1</span>'));
console.log('OK', Object.keys(pages).length, 'pages');
