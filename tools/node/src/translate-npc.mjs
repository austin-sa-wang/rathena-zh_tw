import fs from 'fs-extra'

function combineMessages(messages) {
  return messages
    .map((msg) => msg.replace(/^mes\s+"|";$/g, '').trim())
    .join(' ')
    .trim();
}

function extractMessages(input) {
  const lines = input.split('\n');

  let currentBlock = [];
  let intermediateNpcScriptWithMsgMarkers = '';
  let npcMessages = [];
  let messageIndex = 0;
  let npcName = null;

  for (const line of lines) {
    let command = line.trim();
    if (command.startsWith('mes')) {
      if (command.startsWith(`mes "[`)) {
        npcName = line.match(/\[.*?\]/)?.[0] ?? null;
      } else {
        currentBlock.push(command);
      }
    } else if (command.startsWith('next') || command.startsWith('close') || command.startsWith('end')) {
      if (currentBlock.length > 0) {
        npcMessages.push({
          npcName: npcName,
          message: combineMessages(currentBlock)
        });
        const indentation = line.match(/^\s*/)[0];
        intermediateNpcScriptWithMsgMarkers += `${indentation}%%message${messageIndex}%%\n`;
        messageIndex++;
        currentBlock = [];
        npcName = null;
      }
      intermediateNpcScriptWithMsgMarkers += line + '\n';
    } else {
      intermediateNpcScriptWithMsgMarkers += line + '\n';
    }
  }

  if (currentBlock.length > 0) {
    npcMessages.push({
      npcName: npcName,
      message: combineMessages(currentBlock)
    });
    const indentation = lines[lines.length - 1].match(/^\s*/)[0];
    intermediateNpcScriptWithMsgMarkers += `${indentation}%%message${messageIndex}%%\n`;
  }

  return [intermediateNpcScriptWithMsgMarkers, npcMessages];
}

function translateMessages(npcMessages) {
  // Replace this with your own translation function
  return npcMessages.map(({ npcName, message }) => ({
    npcName: npcName !== null ? translateText(npcName) : null,
    message: translateText(message)
  }));
}

function insertMessagesRegex(intermediateNpcScriptWithMsgMarkers, translatedNpcMessages) {
  const messageMarkerPattern = /(\s*)%%message(\d+)%%\n/g;
  let translatedNpcScript = intermediateNpcScriptWithMsgMarkers.replace(
    messageMarkerPattern,
    (match, indentation, messageIndex) => {
      const { npcName, message } = translatedNpcMessages[messageIndex];

      if (npcName !== null) {
        return `${indentation}mes "${npcName}"${indentation}mes "${message}"\n`;
      } else {
        return `${indentation}mes "${message}"\n`;
      }
    }
  );
  return translatedNpcScript;
}

function translateText(text) {
  // Replace this with your own translation function
  return `__translated__${text}`;
}

const intermediateFileDest = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/output/translatedNpc/intermediateNpcScriptWithMsgMarkers.txt'
const npcMessagesDest = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/output/translatedNpc/npcMessages.json'
const outDest = '/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/output/translatedNpcScript.txt'

async function translateFile () {
  const input = await fs.readFile('/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/inputs/quest-sample-mr-smile.txt', 'utf8');
  const [intermediateNpcScriptWithMsgMarkers, npcMessages] = extractMessages(input);

  await fs.ensureFile(intermediateFileDest)
  await fs.writeFile(intermediateFileDest, intermediateNpcScriptWithMsgMarkers, 'utf8');
  await fs.ensureFile(npcMessagesDest)
  await fs.writeFile(npcMessagesDest, JSON.stringify(npcMessages), 'utf8');

  const translatedMessages = translateMessages(npcMessages);
  const translatedNpcScript = insertMessagesRegex(intermediateNpcScriptWithMsgMarkers, translatedMessages);
  await fs.writeFile('/home/austin/Playspace/ro-sanbox/rathena-zh_tw/tools/output/translatedNpcScript.txt', translatedNpcScript, 'utf8');
}

await translateFile()

process.exit()
