import fs from 'fs-extra';
import path from 'path';
import { translateFile } from './lib-translate.mjs';

// Source and target directories
const NpcScriptSrcDir = 'rathena-zh_tw/tools/inputs/translate-npc-picked'

// Source and target directories
const root = '/home/austin/Playspace/ro-sanbox'
const sourceDir = path.join(root, NpcScriptSrcDir);
const outRoot = path.join(root, 'rathena-zh_tw/tools/output/translatedNpc')
const targetDir = path.join(outRoot, 'dist');
const interDir = path.join(outRoot, 'intermediate')
// const npcScriptWithMesMarkersDir = path.join(intermediateRoot, 'npcScriptWithMarker');;
// const extractedNpcMessagesDest = path.join(intermediateRoot, 'extractedNpcMessages');
// const rawTranslationDest = path.join(intermediateRoot, 'rawTranslation');
// const translatedMessagesDest  = path.join(intermediateRoot, 'translatedMessages');

// Recursively create directory structure and copy files
async function copyDirRecursive(src, dest, interDest) {
  // Create destination directory if it doesn't exist
  await fs.ensureDir(dest);

  // Iterate over all files and directories in the source directory
  const files = await fs.readdir(src);
  for (const file of files) {
    let getFilePath = (dest) => path.join(dest, file);

    const srcPath = getFilePath(src);
    const destPath = getFilePath(dest);
    const interPath = getFilePath(interDest);

    // Check if the file is a directory
    if (fs.lstatSync(srcPath).isDirectory()) {
      // Recursively copy the subdirectory
      await copyDirRecursive(srcPath, destPath, interPath);
    } else {
      // call translate-mob-spawn-file to translate the mob spawn file, then write to destPath
      console.log('processing file: ', srcPath)

      await translateFile({
        inputDest: srcPath,
        interDir: interPath,
        outDest: destPath
      })
    }
  }
}

// Call the recursive function to copy the directory structure
await copyDirRecursive(sourceDir, targetDir, interDir)
  .then(() => console.log(`Directory structure and files processed from "${sourceDir}" to "${targetDir}".`))
  .catch((err) => console.error(err));

console.log('done')
  
process.exit(0)