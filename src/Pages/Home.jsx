import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-5 py-16 w-full flex flex-col justify-center items-center text-center">
        {/* Főcím */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
          Akadálymentességi Kutatás <span className="text-sky-400">Python Környezetben</span>
        </h1>

        {/* Leírás */}
        <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
          Ez az alkalmazás azért jött létre, hogy felmérje a látássérült és képernyőolvasót (screen reader) használó fejlesztők navigációs szokásait, valamint a szintaktikai hibák azonosításának hatékonyságát.
        </p>

        {/* Információs kártya a tesztről */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-10 text-left w-full max-w-xl">
          <h2 className="text-xl font-semibold text-sky-400 mb-3">A vizsgálat menete:</h2>
          <ul className="space-y-2 text-slate-300 list-disc list-inside">
            <li>Összesen <strong>15 gondosan összeállított</strong> Python hibakeresési feladat.</li>
            <li>Beépített szövegfelolvasó a kódrészletek és opciók hallgatásához.</li>
            <li>Egyszerű, akadálymentesített válaszlehetőségek gépelés helyett.</li>
            <li>A válaszadási idő és az eredmények automatikus mentése.</li>
          </ul>
        </div>

        {/* CTA Gombok */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Link
            to="/test"
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-3.5 rounded-lg transition-colors text-center shadow-lg shadow-sky-500/20"
          >
            🚀 Teszt Indítása
          </Link>

          <Link
            to="/admin"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3.5 rounded-lg transition-colors text-center border border-slate-700"
          >
            ⚙️ Admin / Feltöltő
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;