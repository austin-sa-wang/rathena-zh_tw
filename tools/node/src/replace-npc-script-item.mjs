// translate npc script's item names with a lookup table that maps item names to their translated names. only translate matches in mes commands

import fs from 'fs-extra'
import Papa from 'papaparse';

const itemNameEnIdDictDest = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/database/ro-all-item-name-en-and-id-uniq.csv'

const itemNameEnIdDict = await fs.readFile(itemNameEnIdDictDest, 'utf8');
const { data: itemNameAndIdPairs } = await Papa.parse(itemNameEnIdDict, { header: true });

function replaceItemNames(script, itemData) {
  const lines = script.split('\n');
  const outputLines = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('mes')) {
      let modifiedLine = line;

      for (const item of itemData) {
        const itemName = item.name_english;
        const itemId = item.id;
        const itemLink = `" + mesitemlink(${itemId}) + "`;

        if (modifiedLine.includes(itemName)) {
          modifiedLine = modifiedLine.replace(itemName, itemLink);
        }
      }

      outputLines.push(modifiedLine);
    } else {
      outputLines.push(line);
    }
  }

  return outputLines.join('\n');
}

const inputDest = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/inputs/mrsmile.txt'
const outDest = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/output/itemReplaced.txt'

const input = await fs.readFile(inputDest, 'utf8');
const outputScript = replaceItemNames(input, itemNameAndIdPairs);
await fs.writeFile(outDest, outputScript, 'utf8');

console.log('done')

process.exit()
