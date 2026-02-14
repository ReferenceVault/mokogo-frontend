const fs = require('fs');

// 1. DashboardHeader - add Menu import and onMenuClick prop + hamburger button
let h = fs.readFileSync('src/components/DashboardHeader.tsx', 'utf8');
h = h.replace('import { Bell, Heart as HeartIcon } from', 'import { Bell, Heart as HeartIcon, Menu } from');
h = h.replace('onLogout?: () => void\n}', 'onLogout?: () => void\n  onMenuClick?: () => void\n}');
h = h.replace('onLogout,\n}: DashboardHeaderProps)', 'onLogout,\n  onMenuClick,\n}: DashboardHeaderProps)');
h = h.replace(
  '<div className="flex items-center gap-2 sm:gap-8">',
  '<div className="flex items-center gap-2 sm:gap-4">'
);
h = h.replace(
  '<div className="transform transition-transform duration-300 hover:scale-105">',
  '{onMenuClick && (\n              <button\n                onClick={onMenuClick}\n                className="lg:hidden p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"\n                aria-label="Open menu"\n              >\n                <Menu className="w-6 h-6" />\n              </button>\n            )}\n            <div className="transform transition-transform duration-300 hover:scale-105">'
);
h = h.replace(
  '</div>\n            \n            {/* Middle section',
  '</div>\n            \n            {/* Middle section'
);
fs.writeFileSync('src/components/DashboardHeader.tsx', h);
console.log('Header updated');
