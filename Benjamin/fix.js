const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// Eliminar emojis o caracteres raros en textos de nivel
code = code.replace(/announceLevel\('Nivel 4[^']+',/g, "announceLevel('Nivel 4',");
code = code.replace(/announceLevel\('Nivel '\+next\+'[^']+',/g, "announceLevel('Nivel '+next,");
code = code.replace(/announceLevel\('Nivel 1[^']+',/g, "announceLevel('Nivel 1',");
code = code.replace(/textContent='[^']*Nivel '\+G\.level\+' Completado!'/g, "textContent='Nivel '+G.level+' Completado'");

fs.writeFileSync('game.js', code);
