import fs from 'fs-extra';

const inputFile = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/database/itemInfo-with-proper-texture-ref.lua';
const outputFile = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/output/iteminfo-unescaped.lua';

const regex = /(?<!\\)\\([^"\\]|[\u0080-\uffff])/gu;

async function processFile() {
  try {
    const data = await fs.readFile(inputFile, 'utf8');
    const outputString = data.replace(regex, (match) => {
      return match[1];
    });

    await fs.writeFile(outputFile, outputString, 'utf8');
    console.log(`File has been written to: ${outputFile}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

processFile();
