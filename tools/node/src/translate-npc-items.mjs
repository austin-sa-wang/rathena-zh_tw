// translate npc script's item names with a lookup table that maps item names to their translated names. only translate matches in mes commands

import fs from 'fs-extra'

const itemTranslations = {
  "Jellopy": 1001,
  "Fluff": 1033,
  "Clover": 2088
};

function replaceItemNames(script, translations) {
  const regex = /mes\s+"([^"]*)"/g;
  let match;
  let outputScript = script;

  while ((match = regex.exec(script)) !== null) {
    const mesCommand = match[0];
    const mesText = match[1];
    const words = mesText.split(' ');

    words.forEach((word) => {
      const itemName = word.replace(/[^a-zA-Z]/g, '');
      if (translations[itemName]) {
        const itemId = translations[itemName];
        const replacedText = mesText.replace(itemName, `" + mesitemlink(${itemId}) + "`);
        outputScript = outputScript.replace(mesCommand, `mes "${replacedText}"`);
      }
    });
  }
  return outputScript;
}

const inputDest = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/inputs/quest-sample-mr-smile.txt'
const outDest = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/output/itemReplaced.txt'

const input = await fs.readFile(inputDest, 'utf8');
const outputScript = replaceItemNames(input, itemTranslations);
await fs.writeFile(outDest, outputScript, 'utf8');

console.log('done')

process.exit()
