import { HashRouter, Routes, Route } from 'react-router-dom';
import SearchPage from "./pages/SearchPage";
import PropertyPage from "./pages/PropertyPage";
import NotFound from "./pages/NotFound";
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App
