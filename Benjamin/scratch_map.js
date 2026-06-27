const fs = require('fs');
const path = require('path');

const chars = {
  javiera: {
    dir: 'Sprit_Javiera',
    skins: {
      normal: { prefix: 'Javiera', ice: null },
      candy: { dir: 'Skin-Javiera/Sprit_Candy', prefix: 'Candy', ice: 'Ice-Candy.png' },
      sun: { dir: 'Skin-Javiera/Sprit_Sun', prefix: 'Sun', ice: 'Ice-Sun.png' },
      pirate: { dir: 'Skin-Javiera/Sprite_Pirate', prefix: 'Pirate', ice: 'Ice-Pirate.png' }
    }
  },
  paloma: {
    dir: 'Sprit_Paloma',
    skins: {
      normal: { prefix: 'Paloma', ice: null },
      sea: { dir: 'Skin-Paloma/Sprit_Sea', prefix: 'Sea', ice: 'Ice-Sea.png' },
      moon: { dir: 'Skin-Paloma/Sprit_Moon', prefix: 'Moon', ice: 'Ice-Moon.png' }
    }
  },
  sofia: {
    dir: 'Sprit_Sofia',
    skins: {
      normal: { prefix: 'Sofia', ice: 'Ice-Sofia.png' },
      fox: { dir: 'Skin-Sofia/Sprit_Fox', prefix: 'Fox', ice: 'Ice-Fox.png' },
      kraken: { dir: 'Skin-Sofia/Sprit_Kraken', prefix: 'Kraken', ice: 'Ice-Kraken.png' }
    }
  },
  gbenja: {
    dir: 'Sprite_Gbenja',
    skins: {
      normal: { prefix: 'Gbenja', ice: 'Ice-Gbenja.png' },
      meteor: { dir: 'Skin-Gbenja/Sprit_Meteor', prefix: 'Meteor', ice: 'Ice-Meteor.png' }
    }
  }
};

let sprKeys = [];
let pathsObj = {};

for (const [char, conf] of Object.entries(chars)) {
  for (const [skin, skinConf] of Object.entries(conf.skins)) {
    const baseDir = skin === 'normal' ? conf.dir : `${conf.dir}/${skinConf.dir}`;
    const pfx = skinConf.prefix;
    const skinKey = skin === 'normal' ? char : `${char}_${skin}`;
    
    sprKeys.push(`'${skinKey}_down'`);
    sprKeys.push(`'${skinKey}_up'`);
    sprKeys.push(`'${skinKey}_right'`);
    sprKeys.push(`'${skinKey}_left'`);
    
    // For normal Sofia the file is 'Sofía-izquierda.png'
    let fileLeft = `${pfx}-izquierda.png`;
    if (char === 'sofia' && skin === 'normal') fileLeft = `Sofía-izquierda.png`;
    
    pathsObj[`${skinKey}_down`] = `Assets/${baseDir}/${pfx}.png`;
    pathsObj[`${skinKey}_up`] = `Assets/${baseDir}/${pfx}-atras.png`;
    pathsObj[`${skinKey}_right`] = `Assets/${baseDir}/${pfx}-derecha.png`;
    pathsObj[`${skinKey}_left`] = `Assets/${baseDir}/${fileLeft}`;
    
    if (skinConf.ice) {
      sprKeys.push(`'${skinKey}_ice'`);
      pathsObj[`${skinKey}_ice`] = `Assets/${baseDir}/${skinConf.ice}`;
    }
  }
}

fs.writeFileSync('C:/Users/hp/Desktop/Benjamin/assets_map.json', JSON.stringify({ keys: sprKeys, paths: pathsObj }, null, 2));
