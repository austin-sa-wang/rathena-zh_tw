import fs from 'fs-extra'
import mobsZh from '../data/client-iteminfo.json' assert {type: 'json'};
import iconv from 'iconv-lite';

const mobDict = {};
mobsZh.forEach((d) => {
  mobDict[d.id] = d.name_zh_tw;
});

function translateItemInfo (inputFile, outputFile) {
  return fs.readFile(inputFile)
  .then(async (data) => {
    console.log('data', data)
    const content = iconv.decode(data, 'Big5');

    // console.log('content', content)
    const output = content

    await fs.ensureFile(outputFile)
    await fs.writeFile(outputFile, output, {
      encoding: 'utf8',
    });
    console.log('Finished processing file.');
  })
  .catch(err => {
    console.error(err);
  });
}

const inputFilePath = '/home/austin/Playspace/ro-sanbox/Rathena-Client/System/iteminfo-TW.lua' 
const outputFile = 'output/iteminfo-TW.lua'

await translateItemInfo(inputFilePath, outputFile)

process.exit(0);
