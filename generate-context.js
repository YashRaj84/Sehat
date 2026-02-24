const fs = require('fs');
const path = require('path');

// CONFIGURATION: Add folders you want to include (relative to root)
const INCLUDE_DIRS = [
    'backend', // or 'backend'
    'frontend/src', // or 'frontend/src'
];

// CONFIGURATION: File extensions to read
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css'];

// CONFIGURATION: Files/Folders to strictly ignore
const IGNORE = ['node_modules', '.git', 'package-lock.json', 'yarn.lock', 'dist', 'build', '.env'];

const outputFile = 'full_codebase_context.txt';

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (IGNORE.includes(file)) return;
        const fullPath = path.join(dirPath, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (EXTENSIONS.includes(path.extname(file))) {
                arrayOfFiles.push(fullPath);
            }
        }
    });
    return arrayOfFiles;
}

let outputContent = "PROJECT CONTEXT:\n\n";

INCLUDE_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = getAllFiles(dir);
        files.forEach(filePath => {
            const content = fs.readFileSync(filePath, 'utf8');
            outputContent += `\n--- START OF FILE: ${filePath} ---\n`;
            outputContent += content;
            outputContent += `\n--- END OF FILE: ${filePath} ---\n`;
        });
    } else {
        console.log(`Warning: Directory ${dir} not found.`);
    }
});

fs.writeFileSync(outputFile, outputContent);
console.log(`Success! Upload '${outputFile}' to the AI.`);