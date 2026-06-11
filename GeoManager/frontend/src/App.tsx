import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { Continentes } from './pages/continentes';
import { Paises } from './pages/paises';
import { Cidades } from './pages/cidades'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/continentes" element={<Continentes />} />
        <Route path="/paises" element={<Paises />} />
        <Route path="/cidades" element={<Cidades />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;