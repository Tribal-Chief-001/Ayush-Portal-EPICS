const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];
const fileExtensions = ['.tsx', '.ts'];

const replacements = {
  // Backgrounds
  'bg-white': 'bg-[#111111]',
  'bg-slate-50': 'bg-[#0a0a0a]',
  'bg-slate-100': 'bg-[#141414]',
  'bg-gray-50': 'bg-black',
  'bg-slate-200': 'bg-slate-800',
  // Text colors
  'text-slate-900': 'text-slate-100',
  'text-gray-900': 'text-slate-100',
  'text-slate-800': 'text-slate-200',
  'text-slate-700': 'text-slate-300',
  'text-slate-600': 'text-slate-400',
  'text-slate-500': 'text-slate-400',
  // Borders
  'border-slate-200': 'border-white/10',
  'border-slate-100': 'border-white/5',
  'border-gray-100': 'border-white/5',
  'border-gray-200': 'border-white/10',
  // Shadows
  'shadow-sm': 'shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
  'shadow-md': 'shadow-[0_8px_30px_rgba(0,0,0,0.6)]',
  'shadow-lg': 'shadow-[0_15px_40px_rgba(0,0,0,0.8)] shadow-black',
  'shadow-xl': 'shadow-[0_20px_50px_rgba(0,0,0,0.9)] shadow-black',
};

function processDirectory(dirPath) {
  const absoluteDirPath = path.join(__dirname, dirPath);
  const files = fs.readdirSync(absoluteDirPath);

  files.forEach(file => {
    const fullPath = path.join(absoluteDirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(path.join(dirPath, file));
    } else if (fileExtensions.includes(path.extname(file))) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      for (const [light, dark] of Object.entries(replacements)) {
        // Using word boundaries to avoid matching partial classes (like text-slate-500 matching bg-slate-50)
        // Note: Tailwind classes might have pseudo-selectors like hover:bg-white
        // A simple regex: /(?<=^|[\s"':])bg-white(?=[\s"']|$)/g
        
        const regex = new RegExp(`(?<=^|[\\s"':])${light}(?=[\\s"']|$)`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, dark);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

console.log("Starting Theme Migration...");
directories.forEach(dir => {
    if (fs.existsSync(path.join(__dirname, dir))) {
        processDirectory(dir);
    }
});
console.log("Finished.");
