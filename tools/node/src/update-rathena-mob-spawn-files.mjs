import fs from 'fs-extra';
import path from 'path';
import iconv from 'iconv-lite';
import { translateMobNameOfMobSpawnNpcScript } from './lib.mjs';

// Source and target directories
const sourceDir = '../rathena/npc/pre-re/mobs';
const targetDir = 'output/mobs_zh_tw';

// Recursively create directory structure and copy files
async function copyDirRecursive(src, dest) {
  // Create destination directory if it doesn't exist
  await fs.ensureDir(dest);

  // Iterate over all files and directories in the source directory
  const files = await fs.readdir(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    // Check if the file is a directory
    if (fs.lstatSync(srcPath).isDirectory()) {
      // Recursively copy the subdirectory
      await copyDirRecursive(srcPath, destPath);
    } else {
      // call translate-mob-spawn-file to translate the mob spawn file, then write to destPath
      const inputContent = await fs.readFile(srcPath, 'utf8')
      console.log('processing file: ', srcPath)
      const outputContent = await translateMobNameOfMobSpawnNpcScript(inputContent)
      await fs.ensureFile(destPath)
      await fs.writeFile(destPath, iconv.encode(outputContent, 'big5'), { flag: 'w' });
    }
  }
}

// Call the recursive function to copy the directory structure
copyDirRecursive(sourceDir, targetDir)
  .then(() => console.log(`Directory structure and files processed from "${sourceDir}" to "${targetDir}".`))
  .catch((err) => console.error(err));
  