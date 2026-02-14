const fs = require('fs');
const path = 'src/pages/Dashboard.tsx';
let c = fs.readFileSync(path, 'utf8');
const old = 'px-5 py-2.5 w-full sm:w-auto min-h-[44px] bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"';
const neu = old.replace('transition-all duration-300"', 'transition-all duration-300 flex items-center justify-center"');
let n = 0;
while (c.includes(old)) {
  c = c.replace(old, neu);
  n++;
}
fs.writeFileSync(path, c);
console.log('Replaced', n);
