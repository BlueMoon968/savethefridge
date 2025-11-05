export default function Credits() {
    return (
      <div className="card mt-8 mb-4">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            Credits
          </h3>
          
          <div className="space-y-4 text-sm">
            {/* Designer */}
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                GR
              </div>
              <div>
                <p className="font-semibold text-gray-900">Giuseppe Roccolano</p>
                <p className="text-gray-600">Designer & Concept Creator</p>
              </div>
            </div>
  
            {/* Developer */}
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                LM
              </div>
              <div>
                <p className="font-semibold text-gray-900">Luca Mastroianni</p>
                <p className="text-gray-600">Developer | Bluemoon</p>
              </div>
            </div>
  
            {/* Technologies */}
            <div className="pt-2">
              <p className="font-semibold text-gray-900 mb-2">Built with:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  React
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  Vite
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  Tailwind CSS
                </span>
              </div>
            </div>
  
            {/* Open Source Credits */}
            <div className="pt-2">
              <p className="font-semibold text-gray-900 mb-2">Open Source Libraries:</p>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <a 
                    href="https://github.com/mebjas/html5-qrcode" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    html5-qrcode by Minhaz
                  </a>
                  <span className="text-gray-400 ml-1">(Apache-2.0)</span>
                </li>
                <li>
                  <a 
                    href="https://lucide.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Lucide Icons
                  </a>
                  <span className="text-gray-400 ml-1">(ISC)</span>
                </li>
                <li>
                  <a 
                    href="https://world.openfoodfacts.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Open Food Facts API
                  </a>
                  <span className="text-gray-400 ml-1">(ODbL)</span>
                </li>
              </ul>
            </div>
  
            {/* Footer */}
            <div className="pt-4 text-center text-xs text-gray-500 border-t border-gray-100">
              <p>Made with ❤️ for reducing food waste</p>
              <p className="mt-1">SaveTheFridge © 2025</p>
            </div>
          </div>
        </div>
      </div>
    );
  }