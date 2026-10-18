import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { db } from "../firebase.js";
import { doc, setDoc } from 'firebase/firestore';

const AdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 15 darab előre összeállított Python hibakeresési feladat
  const sampleTasks = [
    {
      id: 'task_1',
      title: '1. Feladat: Lezáratlan zárójel',
      buggyCode: 'def szamol_osszeg(a, b):\n    eredmeny = a + b\n    print(eredmeny\n    return eredmeny',
      correctOption: 'B',
      options: [
        { id: 'A', text: 'A) Hiányzó kettőspont (:) a függvénydefiníció végén.' },
        { id: 'B', text: 'B) Lezáratlan zárójel a print() függvényben a 3. sorban.' },
        { id: 'C', text: 'C) Elgépelt változónév az összeadás során.' },
        { id: 'D', text: 'D) Helytelen visszatérési érték a return kulcsszónál.' }
      ]
    },
    {
      id: 'task_2',
      title: '2. Feladat: Hiányzó kettőspont',
      buggyCode: 'if x > 10\n    print("X nagyobb mint 10")',
      correctOption: 'A',
      options: [
        { id: 'A', text: 'A) Hiányzó kettőspont (:) az if feltétel végén.' },
        { id: 'B', text: 'B) Hibás idézőjel használat.' },
        { id: 'C', text: 'C) Az x változó nincs definiálva.' },
        { id: 'D', text: 'D) Hibás behúzás (indentation).' }
      ]
    },
    {
      id: 'task_3',
      title: '3. Feladat: Összehasonlító vs. Értékadó operátor',
      buggyCode: 'szam = 5\nif szam = 10:\n    print("A szám tíz")',
      correctOption: 'C',
      options: [
        { id: 'A', text: 'A) A print elejéről hiányzik a zárójel.' },
        { id: 'B', text: 'B) A szam változó típusa nem megfelelő.' },
        { id: 'C', text: 'C) Egyenlőségvizsgálathoz (==) kell használni az értékadás (=) helyett.' },
        { id: 'D', text: 'D) A feltételből hiányzik a zárójel.' }
      ]
    },
    {
      id: 'task_4',
      title: '4. Feladat: Hibás behúzás (IndentationError)',
      buggyCode: 'def koszont():\nprint("Szia!")',
      correctOption: 'D',
      options: [
        { id: 'A', text: 'A) A def kulcsszó után hiányzik a kettőspont.' },
        { id: 'B', text: 'B) A függvény neve érvénytelen.' },
        { id: 'C', text: 'C) Hiányzik a return utasítás.' },
        { id: 'D', text: 'D) Hiányzik a behúzás (4 szóköz) a print sora előtt.' }
      ]
    },
    {
      id: 'task_5',
      title: '5. Feladat: Elgépelt változónév (NameError)',
      buggyCode: 'felhasznalo_nev = "Anna"\nprint(felhasznalo_new)',
      correctOption: 'B',
      options: [
        { id: 'A', text: 'A) Hiányzó idézőjel az "Anna" érték körül.' },
        { id: 'B', text: 'B) Elgépelt változónév a print-ben (felhasznalo_new a felhasznalo_nev helyett).' },
        { id: 'C', text: 'C) A print függvény nagybetűvel kellene kezdődjön.' },
        { id: 'D', text: 'D) Hiányzik a pontosvessző a sor végéről.' }
      ]
    },
    {
      id: 'task_6',
      title: '6. Feladat: Típuskonverzió hiánya (TypeError)',
      buggyCode: 'kor = input("Hány éves vagy? ")\nkovetkezo_ev = kor + 1',
      correctOption: 'A',
      options: [
        { id: 'A', text: 'A) Az input() sztringet ad vissza, számmá kell alakítani (int(kor)).' },
        { id: 'B', text: 'B) Az input() függvény nem fogad el paramétert.' },
        { id: 'C', text: 'C) A + operátor nem használható számokkal.' },
        { id: 'D', text: 'D) A kor változó neve érvénytelen.' }
      ]
    },
    {
      id: 'task_7',
      title: '7. Feladat: Lista index túlcsordulás (IndexError)',
      buggyCode: 'gyumolcsok = ["alma", "banán"]\nprint(gyumolcsok[2])',
      correctOption: 'C',
      options: [
        { id: 'A', text: 'A) A listát kapcsos zárójellel {} kellene megadni.' },
        { id: 'B', text: 'B) A szavak után hiányzik a kettőspont.' },
        { id: 'C', text: 'C) Nincs 2-es indexű elem (az indexelés 0-tól indul: 0 és 1 van).' },
        { id: 'D', text: 'D) A print nem tud listaelemeket kiíratni.' }
      ]
    },
    {
      id: 'task_8',
      title: '8. Feladat: Lezáratlan sztring (SyntaxError)',
      buggyCode: 'uband_nev = "CodeA11y\nprint(uband_nev)',
      correctOption: 'A',
      options: [
        { id: 'A', text: 'A) Hiányzik a lezáró idézőjel a "CodeA11y" sztring végéről.' },
        { id: 'B', text: 'B) A print nem fogad el változót.' },
        { id: 'C', text: 'C) A változó neve nem tartalmazhat aláhúzást.' },
        { id: 'D', text: 'D) Hiányzó zárójel a print sora végén.' }
      ]
    },
    {
      id: 'task_9',
      title: '9. Feladat: Végtelen ciklus veszélye',
      buggyCode: 'i = 0\nwhile i < 5:\n    print(i)',
      correctOption: 'B',
      options: [
        { id: 'A', text: 'A) A while feltételéből hiányzik a kettőspont.' },
        { id: 'B', text: 'B) Az i értéke nem növekszik (i += 1 hiányzik), így végtelen ciklus keletkezik.' },
        { id: 'C', text: 'C) Az i kezdeti értéke csak 1 lehet.' },
        { id: 'D', text: 'D) A while ciklus nem támogatja a print függvényt.' }
      ]
    },
    {
      id: 'task_10',
      title: '10. Feladat: Helytelen for ciklus szintaxis',
      buggyCode: 'for i in range(5)\n    print(i)',
      correctOption: 'A',
      options: [
        { id: 'A', text: 'A) Hiányzó kettőspont (:) a range(5) után.' },
        { id: 'B', text: 'B) A range függvény nem létezik Pythonban.' },
        { id: 'C', text: 'C) Az i ciklusváltozót előre meg kell határozni.' },
        { id: 'D', text: 'D) A print mögé kapcsos zárójel kell.' }
      ]
    },
    {
      id: 'task_11',
      title: '11. Feladat: Nullával való osztás (ZeroDivisionError)',
      buggyCode: 'szamlalo = 10\nnevezo = 0\neredmeny = szamlalo / nevezo',
      correctOption: 'D',
      options: [
        { id: 'A', text: 'A) A perjel (/) nem használható osztásra.' },
        { id: 'B', text: 'B) A változónevek nem lehetnek ékezet nélküliek.' },
        { id: 'C', text: 'C) Az eredményt nem lehet változóba menteni.' },
        { id: 'D', text: 'D) Nullával való osztás nem megengedett (ZeroDivisionError).' }
      ]
    },
    {
      id: 'task_12',
      title: '12. Feladat: Hibás kulcs szótárban (KeyError)',
      buggyCode: 'diak = {"nev": "Péter", "kor": 20}\nprint(diak["cim"])',
      correctOption: 'C',
      options: [
        { id: 'A', text: 'A) A szótárt szögletes zárójellel [] kell létrehozni.' },
        { id: 'B', text: 'B) A kettőspontok helyett egyenlőségjelet kell használni.' },
        { id: 'C', text: 'C) A "cim" kulcs nem létezik a szótárban (KeyError).' },
        { id: 'D', text: 'D) A print nem tud szótárelemeket kiíratni.' }
      ]
    },
    {
      id: 'task_13',
      title: '13. Feladat: Hibás paraméterszám függvényhíváskor',
      buggyCode: 'def osszead(a, b):\n    return a + b\n\nprint(osszead(5))',
      correctOption: 'B',
      options: [
        { id: 'A', text: 'A) A return kulcsszó nem használható függvényen belül.' },
        { id: 'B', text: 'B) A függvény 2 paramétert vár, de csak 1 lett átadva (TypeError).' },
        { id: 'C', text: 'C) A print-en belül nem lehet függvényt hívni.' },
        { id: 'D', text: 'D) A függvény nevéből hiányzik a zárójel.' }
      ]
    },
    {
      id: 'task_14',
      title: '14. Feladat: Logikai operator elgépelése',
      buggyCode: 'a = True\nb = False\nif a AND b:\n    print("Mindkettő igaz")',
      correctOption: 'A',
      options: [
        { id: 'A', text: 'A) A logikai "és" operátor Pythonban kisbetűs: and (nem AND).' },
        { id: 'B', text: 'B) A True és False értékeket kisbetűvel kell írni.' },
        { id: 'C', text: 'C) Az if feltételbe nem tehető logikai operátor.' },
        { id: 'D', text: 'D) A print szóból hiányzik az idézőjel.' }
      ]
    },
    {
      id: 'task_15',
      title: '15. Feladat: Lista elem hozzáadás hibás metódussal',
      buggyCode: 'szamok = [1, 2, 3]\nszamok.add(4)',
      correctOption: 'C',
      options: [
        { id: 'A', text: 'A) A listákat nem lehet bővíteni létrehozás után.' },
        { id: 'B', text: 'B) A szögletes zárójel helyett sima zárójel kell.' },
        { id: 'C', text: 'C) Listákhoz az .append() metódust kell használni, az .add() halmazokhoz van.' },
        { id: 'D', text: 'D) A 4-es számot idézőjelbe kell tenni.' }
      ]
    }
  ];

  // feltöltés a Firebase "tasks" gyűjteményébe
  const handleUploadTasks = async () => {
    setLoading(true);
    setMessage('');

    try {
      for (const task of sampleTasks) {
        // "tasks" gyűjtemény, a dokumentum ID-ja pl. "task_1", "task_2", stb.
        await setDoc(doc(db, "tasks", task.id), {
          title: task.title,
          buggyCode: task.buggyCode,
          correctOption: task.correctOption,
          options: task.options
        });
      }
      setMessage('✅ Mind a 15 feladat sikeresen feltöltve a Firebase adatbázisba!');
    } catch (error) {
      console.error("Feltöltési hiba:", error);
      setMessage('❌ Hiba történt a feltöltés során: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-5 py-16 w-full text-center">
        {/* <h1 className="text-3xl font-bold mb-4">
          ⚙️ Firebase Adatbázis Feltöltő
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Ezen az oldalon egyetlen gombnyomással feltöltheted mind a 15 előre elkészített 
          Python hibakeresési feladatot a Firebase Firestore <code className="bg-slate-800 px-2 py-1 rounded text-sky-400">tasks</code> gyűjteményébe.
        </p> */}
        Ignore that tamas xd
        {/* <button
          onClick={handleUploadTasks}
          disabled={loading}
          className={`px-8 py-4 rounded-lg font-bold text-lg transition-all cursor-pointer shadow-lg ${
            loading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/25'
          }`}
        >
          {loading ? 'Feltöltés folyamatban... ⏳' : '🚀 15 Kérdés Feltöltése a Firebase-re'}
        </button> */}

        {message && (
          <div className={`mt-8 p-4 rounded-lg font-semibold ${
            message.includes('✅') 
              ? 'bg-emerald-950 text-emerald-200 border border-emerald-600' 
              : 'bg-rose-950 text-rose-200 border border-rose-600'
          }`}>
            {message}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;