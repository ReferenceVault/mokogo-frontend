const fs = require("fs");
const path = "src/components/MessagesContent.tsx";
let c = fs.readFileSync(path, "utf8");

// 1. Message input - touch targets
c = c.replace(
  'className="flex items-end gap-2"',
  'className="flex items-end gap-2 flex-wrap"'
);
c = c.replace(
  '<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">\n                    <span className="text-xl text-gray-600">+</span>\n                  </button>',
  '<button className="hidden sm:flex p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-lg transition-colors items-center justify-center">\n                    <span className="text-xl text-gray-600">+</span>\n                  </button>'
);
c = c.replace(
  'placeholder="Type your message..."\n                    disabled={sending}\n                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-50"',
  'placeholder="Type your message..."\n                    disabled={sending}\n                    className="flex-1 min-h-[44px] px-4 py-2.5 border border-gray-200 rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-50"'
);
c = c.replace(
  '<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">\n                    <Paperclip className="w-5 h-5 text-gray-600" />\n                  </button>\n                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">\n                    <ImageIcon className="w-5 h-5 text-gray-600" />\n                  </button>',
  '<button className="hidden sm:flex p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-lg transition-colors items-center justify-center">\n                    <Paperclip className="w-5 h-5 text-gray-600" />\n                  </button>\n                  <button className="hidden sm:flex p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-lg transition-colors items-center justify-center">\n                    <ImageIcon className="w-5 h-5 text-gray-600" />\n                  </button>'
);
c = c.replace(
  'className="w-10 h-10 bg-orange-400 text-white rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"',
  'className="min-h-[44px] min-w-[44px] bg-orange-400 text-white rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"'
);

// 2. Profile panel - fixed overlay on mobile
c = c.replace(
  '{/* Right Panel - Property & User Profile */}\n      {selectedConversation && showProfile && (\n        <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">',
  '{/* Right Panel - Property & User Profile */}\n      {selectedConversation && showProfile && (\n        <div className="fixed lg:relative inset-y-0 right-0 z-40 w-full max-w-sm lg:max-w-none lg:w-80 border-l border-gray-200 bg-white overflow-y-auto shadow-xl lg:shadow-none">'
);

// 3. Profile close button - touch target
c = c.replace(
  '<button\n                onClick={() => setShowProfile(false)}\n                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"\n              >\n                <X className="w-5 h-5 text-gray-600" />\n              </button>',
  '<button\n                onClick={() => setShowProfile(false)}\n                className="p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"\n              >\n                <X className="w-5 h-5 text-gray-600" />\n              </button>'
);

// 4. Profile toggle button - touch target
c = c.replace(
  'className="p-2 hover:bg-gray-100 rounded-lg transition-colors"\n                  title={showProfile ? \'Hide profile\' : \'Show profile\'}',
  'className="p-2 min-h-[44px] min-w-[44px] hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center flex-shrink-0"\n                  title={showProfile ? \'Hide profile\' : \'Show profile\'}'
);

// 5. Message bubbles - better mobile width
c = c.replace(
  'flex gap-2 max-w-[70%]',
  'flex gap-2 max-w-[85%] sm:max-w-[70%]'
);

// 6. Conversation list items - ensure touch target
c = c.replace(
  'className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                    isSelected ? \'bg-orange-50 border-l-4 border-l-orange-400\' : \'\'
                  }`}',
  'className={`p-4 min-h-[72px] border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                    isSelected ? \'bg-orange-50 border-l-4 border-l-orange-400\' : \'\'
                  }`}'
);

// 7. Delete Chat menu button - touch target
c = c.replace(
  'className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"',
  'className="w-full text-left px-4 py-3 min-h-[44px] text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"'
);

fs.writeFileSync(path, c);
console.log("Updated MessagesContent part 2");
