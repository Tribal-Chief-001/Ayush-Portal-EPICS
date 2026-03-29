const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];
const fileExtensions = ['.tsx', '.ts'];

const replacements = [
  {
    regex: /shadow-\[0_20px_50px_rgba\(0,0,0,0\.9\)\] shadow-black/g,
    replacement: 'shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] dark:shadow-black'
  },
  {
    regex: /shadow-\[0_15px_40px_rgba\(0,0,0,0\.8\)\] shadow-black/g,
    replacement: 'shadow-xl shadow-slate-200/50 dark:shadow-[0_15px_40px_rgba(0,0,0,0.8)] dark:shadow-black'
  },
  {
    regex: /shadow-\[0_10px_30px_rgba\(0,0,0,0\.5\)\] shadow-black/g,
    replacement: 'shadow-lg shadow-slate-200/50 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] dark:shadow-black'
  },
  {
    regex: /shadow-\[0_30px_60px_rgba\(0,0,0,0\.95\)\] shadow-black/g,
    replacement: 'shadow-2xl shadow-slate-200/50 dark:shadow-[0_30px_60px_rgba(0,0,0,0.95)] dark:shadow-black'
  },
  {
    regex: /bg-\[\#111\]/g,
    replacement: 'bg-white dark:bg-[#111]'
  },
  // We need to be careful with border-slate-800 to not ruin dark mode
  {
    regex: /border-slate-800/g,
    replacement: 'border-slate-200 dark:border-slate-800'
  },
  {
    regex: /border-slate-200 dark:border-slate-200 dark:border-slate-800/g, // in case of double replace
    replacement: 'border-slate-200 dark:border-slate-800'
  }
];

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

      replacements.forEach(({regex, replacement}) => {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Shadows/BGs fixed: ${fullPath}`);
      }
    }
  });
}

console.log("Starting shadow and bg fixes...");
directories.forEach(dir => processDirectory(dir));
console.log("Finished.");
