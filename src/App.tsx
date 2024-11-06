import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProviderDetails from "./pages/ProviderDetails";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/api/:provider" element={<ProviderDetails />} />
      <Route path="/api/:provider/:apiName" element={<ProviderDetails />} />
    </Routes>
  </Router>
);

export default App;
