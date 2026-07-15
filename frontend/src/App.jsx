import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AnalyzeIncident from './pages/AnalyzeIncident';
import IncidentHistory from './pages/IncidentHistory';
import IncidentResult from './pages/IncidentResult';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/analyze">Analyze Incident</NavLink>
        <NavLink to="/history">Incident History</NavLink>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyze" element={<AnalyzeIncident />} />
          <Route path="/history" element={<IncidentHistory />} />
          <Route path="/incidents/:id" element={<IncidentResult />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
