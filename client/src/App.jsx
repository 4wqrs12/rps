import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import BotMatchPage from "./components/BotMatchPage";

function App() {
  return (
    <div>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bot" element={<BotMatchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
