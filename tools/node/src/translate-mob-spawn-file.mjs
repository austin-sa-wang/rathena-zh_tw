import fs from 'fs-extra'
import mobsZh from '../data/mob-id-name-zh_tw.json' assert {type: 'json'};

const mobDict = {};
mobsZh.forEach((d) => {
  mobDict[d.id] = d.name_zh_tw;
});

function translateMobNameOfMobSpawnNpcScript (inputFile, outputFile) {
  return fs.readFile(inputFile, 'utf8')
  .then(async (data) => {
    const output = data
      .split('\n')
      .map((line) => {
        // Ignore empty lines and comments
        if (line.trim() === '' || line.trim().startsWith('//')) {
          return line;
        }

        // Split line into fields and look up ObjectName in dictionary
        const segments = line.split(/[\t]/);
        const mobId = segments[3].split(',')[0]

        // Replace ObjectName with matching value in dictionary (if any)
        const newLine = [segments[0], segments[1], mobDict[mobId], segments[3]].join('\t');

        return newLine;
      })
      .join('\n');

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

const inputFilePath = '../rathena/npc/pre-re/mobs/dungeons/abyss.txt' 
const outputFile = 'output/output.txt'

await translateMobNameOfMobSpawnNpcScript(inputFilePath, outputFile)

process.exit(0);
