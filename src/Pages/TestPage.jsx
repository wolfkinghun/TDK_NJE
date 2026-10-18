import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { db } from '../firebase.js';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TestPage = () => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(1); // 1-től 15-ig
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [status, setStatus] = useState('in_progress'); 
  const [feedback, setFeedback] = useState('');

  // Az aktuális feladat betöltése Firebase-ből
  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setSelectedOption('');
      setStatus('in_progress');
      setFeedback('');

      try {
        const taskId = `task_${currentTaskIndex}`;
        const docRef = doc(db, "tasks", taskId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTaskData(docSnap.data());
          setStartTime(Date.now());
        } else {
          setTaskData(null);
          setFeedback('Nincs több feladat az adatbázisban.');
        }
      } catch (error) {
        console.error("Hiba a feladat betöltésekor:", error);
        setFeedback('Hiba történt az adatbázis kapcsolódásakor.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [currentTaskIndex]);

  // Szövegfelolvasó funkció
  const speakText = (textToSpeak) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'hu-HU';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Felolvasási hiba:', err);
    }
  };

  // A kód és az összes opció részletes felolvasása
  const readFullTask = () => {
    if (!taskData) return;
    
    let optionsText = "";
    if (taskData.options && Array.isArray(taskData.options)) {
      optionsText = taskData.options.map(opt => opt.text).join('. ');
    }

    const taskText = `${currentTaskIndex}. feladat. A vizsgált kódrészlet: ${taskData.buggyCode}. A válaszlehetőségek a következők: ${optionsText}`;
    speakText(taskText);
  };

  // Ellenőrzés és válasz mentése Firebase-be
  const handleCheck = async (e) => {
    e.preventDefault();

    if (!selectedOption) {
      setFeedback('Kérlek, válassz ki egy opciót!');
      speakText('Kérlek, válassz ki egy opciót!');
      return;
    }

    const timeSpent = startTime ? parseFloat(((Date.now() - startTime) / 1000).toFixed(1)) : 0;
    const isCorrect = selectedOption === taskData.correctOption;

    try {
      // Eredmény mentése a "results" gyűjteménybe
      await addDoc(collection(db, "results"), {
        taskId: `task_${currentTaskIndex}`,
        userAnswer: selectedOption,
        isCorrect: isCorrect,
        timeSpentSeconds: timeSpent,
        timestamp: serverTimestamp()
      });

      if (isCorrect) {
        setStatus('success');
        setFeedback(`Helyes válasz! Megoldási idő: ${timeSpent} másodperc. Az eredmény elmentve!`);
        speakText(`Gratulálok! Helyes válasz. Megoldási idő: ${timeSpent} másodperc.`);
      } else {
        setStatus('error');
        setFeedback('Nem ez a helyes válasz. Próbáld újra!');
        speakText('Nem ez a helyes válasz. Próbáld újra!');
      }
    } catch (error) {
      console.error("Hiba a mentés során:", error);
      setFeedback('Hiba történt a válasz elmentésekor.');
    }
  };

  // Következő feladatra ugrás
  const handleNextTask = () => {
    if (currentTaskIndex < 15) {
      setCurrentTaskIndex(prev => prev + 1);
    }
  };

  // Előző feladatra ugrás
  const handlePrevTask = () => {
    if (currentTaskIndex > 1) {
      setCurrentTaskIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Header />
        <main className="flex-1 flex justify-center items-center text-xl text-sky-400">
          Feladat betöltése az adatbázisból... ⌛
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-5 py-10 w-full">
        {/* Feladat léptető sáv */}
        <div className="flex justify-between items-center mb-6 bg-slate-900 p-4 rounded-lg border border-slate-800">
          <button
            onClick={handlePrevTask}
            disabled={currentTaskIndex === 1}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md font-semibold transition-colors cursor-pointer"
          >
            ← Előző
          </button>

          <span className="font-bold text-sky-400 text-lg">
            {currentTaskIndex}. Feladat / 15
          </span>

          <button
            onClick={handleNextTask}
            disabled={currentTaskIndex === 15}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md font-semibold transition-colors cursor-pointer"
          >
            Következő →
          </button>
        </div>

        {taskData ? (
          <>
            <h1 className="text-3xl font-bold mb-3">
              {currentTaskIndex}. Feladat: Python Szintaktikai Hiba
            </h1>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Hallgasd meg a kódot és a lehetőségeket, majd jelöld be a helyes hibát!
            </p>

            {/* Kód doboz */}
            <div className="bg-slate-900 p-5 rounded-lg mb-6 border border-slate-800">
              <h2 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Vizsgált kódrészlet:
              </h2>
              <pre className="text-sky-400 font-mono text-lg overflow-x-auto whitespace-pre-wrap">
                {taskData.buggyCode}
              </pre>
            </div>

            {/* Felolvasó gombok */}
            <div className="bg-slate-800 p-4 rounded-lg mb-6 flex gap-3 items-center border border-slate-700">
              <button 
                type="button"
                onClick={readFullTask}
                className="bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold px-5 py-2.5 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                🔊 Feladat és Opciók Felolvasása
              </button>

              <button 
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2.5 rounded-md transition-colors cursor-pointer"
              >
                ⏹️ Leállítás
              </button>
            </div>

            {/* A-B-C-D Opciók választó */}
            <form onSubmit={handleCheck}>
              <fieldset className="border-0 p-0 m-0 mb-6">
                <legend className="block font-semibold mb-3 text-slate-300 text-lg">
                  Válaszd ki a hiba leírását:
                </legend>

                <div className="flex flex-col gap-3">
                  {taskData.options?.map((opt) => (
                    <label 
                      key={opt.id} 
                      className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedOption === opt.id 
                          ? 'bg-sky-950/40 border-sky-500 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="bugOption" 
                        value={opt.id}
                        checked={selectedOption === opt.id}
                        onChange={(e) => {
                          setSelectedOption(e.target.value);
                          speakText(opt.text);
                        }}
                        className="w-5 h-5 text-sky-600 accent-sky-500 cursor-pointer"
                      />
                      <span className="font-medium text-base">{opt.text}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={status === 'success'}
                className={`w-full py-3.5 rounded-md font-bold text-base transition-colors cursor-pointer ${
                  status === 'success' 
                    ? 'bg-green-600 text-white cursor-default' 
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20'
                }`}
              >
                {status === 'success' ? '✓ Megoldva & Elmentve' : 'Válasz Beküldése & Mentés'}
              </button>
            </form>

            {/* Visszajelzés */}
            {feedback && (
              <div 
                className={`mt-5 p-4 rounded-lg font-semibold text-center border ${
                  status === 'success' 
                    ? 'bg-emerald-950 text-emerald-200 border-emerald-600' 
                    : 'bg-rose-950 text-rose-200 border-rose-600'
                }`}
                aria-live="polite"
              >
                {feedback}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-rose-400 text-lg">
            {feedback || 'Nem található feladat ezen az indexen.'}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TestPage;