import './styles/styles.css';
import './styles/empleados.css';
import './styles/clientes.css';
import './styles/ventas.css';
import './styles/productos.css';

import Index from './components/index.jsx';
import Clientes from './components/clientes.jsx';
import Empleados from './components/empleados.jsx';
import Ventas from './components/ventas.jsx';
import Productos from './components/productos.jsx';
import WelcomePage from './components/WelcomePage.jsx';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/index" element={<Index />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/productos" element={<Productos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
