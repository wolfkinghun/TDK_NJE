import React from 'react';

const Header = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center text-slate-100">
      {/* Logó / Kutatás címe */}
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg tracking-wide">
          IDk bro 67 majd ott fasza header
        </span>
      </div>

      {/* Navigáció */}
      <nav aria-label="Fő navigáció">
        <ul className="flex gap-6 list-none m-0 p-0">
          <li>
            <a 
              href="/" 
              className="text-slate-400 hover:text-sky-400 font-medium transition-colors"
            >
              Kezdőlap
            </a>
          </li>
          <li>
            <a 
              href="/test" 
              className="text-sky-400 font-semibold hover:underline"
            >
              Teszt Indítása
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;