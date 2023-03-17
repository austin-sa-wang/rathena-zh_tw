import mobsZh from '../data/mob-id-name-zh_tw.json' assert {type: 'json'};

const mobDict = {};
mobsZh.forEach((d) => {
  mobDict[d.id] = d.name_zh_tw;
});

const scriptRegex = /On.+?:/g;

export function translateMobNameOfMobSpawnNpcScript (data) {
  const output = data
    .split('\n')
    .map((line) => {
      // Ignore empty lines and comments
      if (line.trim() === '' || line.trim().startsWith('//') || scriptRegex.test(line) || line.startsWith('  ') || line.startsWith('\t') || line.startsWith('}')) {
        return line;
      }

      // Split line into fields and look up ObjectName in dictionary
      const segments = line.split(/[\t]/);
      const scriptObjectType = segments[1];

      if (scriptObjectType !== 'monster' && scriptObjectType !== 'boss_monster') {
        return line
      }

      const mobId = segments[3].split(',')[0]

      // Replace ObjectName with matching value in dictionary (if any)
      const newLine = [segments[0], segments[1], mobDict[mobId], segments[3]].join('\t');

      return newLine;
    })
    .join('\n');

  return output
}
