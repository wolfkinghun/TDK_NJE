import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import TestPage from './Pages/TestPage';
import AdminPage from './Pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;