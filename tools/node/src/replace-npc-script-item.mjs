// translate npc script's item names with a lookup table that maps item names to their translated names. only translate matches in mes commands

import fs from 'fs-extra'
import { replaceItemNames } from './lib-replace-item.mjs'

const inputDest = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/inputs/mrsmile.txt'
const outDest = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/output/itemReplaced.txt'

const input = await fs.readFile(inputDest, 'utf8');
const outputScript = replaceItemNames(input);
console.log('outputScript: ', outputScript)
await fs.writeFile(outDest, outputScript, 'utf8');

console.log('done')

process.exit()
