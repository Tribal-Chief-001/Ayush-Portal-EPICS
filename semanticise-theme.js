const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];
const fileExtensions = ['.tsx', '.ts'];

const dynamicPairs = {
  // Backgrounds
  'bg-[#111111]': 'bg-white dark:bg-[#111111]',
  'bg-[#0a0a0a]': 'bg-slate-50 dark:bg-[#0a0a0a]',
  'bg-[#141414]': 'bg-slate-100 dark:bg-[#141414]',
  'bg-black': 'bg-white dark:bg-black',
  'bg-slate-800': 'bg-slate-100 dark:bg-slate-800',
  // Text colors
  'text-slate-100': 'text-slate-900 dark:text-slate-100',
  'text-slate-200': 'text-slate-800 dark:text-slate-200',
  'text-slate-300': 'text-slate-700 dark:text-slate-300',
  'text-slate-400': 'text-slate-500 dark:text-slate-400',
  // Borders
  'border-white/10': 'border-slate-200 dark:border-white/10',
  'border-white/5': 'border-slate-200 dark:border-white/5',
};

function processDirectory(dirPath) {
  const absoluteDirPath = path.join(__dirname, dirPath);
  if (!fs.existsSync(absoluteDirPath)) return;
  
  const files = fs.readdirSync(absoluteDirPath);

  files.forEach(file => {
    const fullPath = path.join(absoluteDirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(path.join(dirPath, file));
    } else if (fileExtensions.includes(path.extname(file))) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      for (const [darkOnly, dynamic] of Object.entries(dynamicPairs)) {
        // Only replace if NOT already prefixed with dark:
        // Regex to find darkOnly class NOT preceded by dark:
        // And NOT already followed by another variant of itself
        
        // Simple approach: find darkOnly and replace with dynamic
        // but avoid replacing if it was already replaced (though dynamic contains darkOnly)
        
        const regex = new RegExp(`(?<!dark:)(?<=^|[\\s"':])${darkOnly.replace('[', '\\[').replace(']', '\\]').replace('/', '\\/')}(?=[\\s"']|$)`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, dynamic);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Semanticised: ${fullPath}`);
      }
    }
  });
}

console.log("Starting Theme Semanticisation...");
directories.forEach(dir => {
    processDirectory(dir);
});
console.log("Finished.");
