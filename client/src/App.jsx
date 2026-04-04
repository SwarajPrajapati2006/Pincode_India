import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import PincodeDetail from "./pages/PincodeDetail";
import About from "./pages/About";
import SplashScreen from "./components/SplashScreen";

export default function App() {
  return (
    <BrowserRouter>
      <SplashScreen>
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/pincode/:pincode" element={<PincodeDetail />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </SplashScreen>
    </BrowserRouter>
  );
}
