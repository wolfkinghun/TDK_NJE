import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-6 px-8 text-slate-500 text-center text-sm">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        <p className="m-0">
          © {new Date().getFullYear()} Programozási Akadálymentességi Kutatási Projekt
        </p>
        <p className="m-0 text-xs text-slate-600">
          Készült a vak és gyengénlátó fejlesztők kódolási élményének javításáért.
        </p>
      </div>
    </footer>
  );
};

export default Footer;