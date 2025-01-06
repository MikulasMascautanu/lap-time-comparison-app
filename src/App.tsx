import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CircuitList from "./components/CircuitList";
import CircuitDetail from "./components/CircuitDetail";
import DriverManagement from "./components/DriverManagement";
import MnemonicForm from "./components/MnemonicForm";
import Navbar from "./components/Navbar";
import { Suspense } from "react";
import CircuitAdmin from "./components/CircuitAdmin";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto p-8">
            <Routes>
              <Route path="/" element={<CircuitList />} />
              <Route path="/circuit/:circuitId" element={<CircuitDetail />} />
              <Route path="/drivers" element={<DriverManagement />} />
              <Route path="/mnemonic" element={<MnemonicForm />} />
              <Route path="/admin" element={<CircuitAdmin />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Suspense>
  );
}

export default App;
