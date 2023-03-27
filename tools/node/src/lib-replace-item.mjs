import Papa from 'papaparse';
import fs from 'fs-extra'

const itemNameEnIdDictDest = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/database/ro-all-item-name-en-and-id-uniq.csv'

const itemNameEnIdDict = await fs.readFile(itemNameEnIdDictDest, 'utf8');
const { data } = await Papa.parse(itemNameEnIdDict, { header: true });

const parsedItems = data.map(({ name_english: name, id }) => ({ name, id }))

const items = parsedItems
.filter(item => {
  const { name } = item;
  return ![
    'thank You',
    'i respect You',
    `knight's Honor`,
    'sword',
    'mace',
    'bow',
    'katar',
    'dagger',
    'spear',
    'staff',
    'whip',
    'book',
    'instrument',
    'robe',
    'armor',
    'shield',
    'shoes',
    'hat',
    'gloves',
    'accessory',
    'arrow',
    'bullet',
    'mace',
    'knuckle',
    'claw',
    'fist',
    'soul',
    'orange',
    'honey',
    'grape',
    'amulet',
    'pass',
    'necklass',
    'guard',
    'ring',
    'voucher',
    'ticket',
    'card',
    'axe',
    'hat',
    'wang',
    'rope',
    'blade',
    'stone'
  ].includes(name.toLowerCase());
})

// sort pairs by name length descending so that longer names are replaced first
items.sort((a, b) => b.name.length - a.name.length);

function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function replaceItemNames(npcScript) {
  const lines = npcScript.split('\n');
  const outputLines = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (/^mes(?! \"\[)/.test(trimmedLine)) {
      let modifiedLine = line;

      for (const item of items) {
        const itemName = escapeRegex(item.name);
        const itemId = item.id;
        const itemLink = `" + mesitemlink(${itemId}) + "`;

        // match item name surrounded by word boundaries or F
        const regex = new RegExp('(\\b|F)' + `(${itemName})` + '\\b', 'gi');

        // replace item name with item link, excluding the F prefix (this is a hack to avoid replacing item names right after color codes)
        modifiedLine = modifiedLine.replace(regex, `$1${itemLink}`);
      }

      outputLines.push(modifiedLine);
    } else {
      outputLines.push(line);
    }
  }

  return outputLines.join('\n');
}
