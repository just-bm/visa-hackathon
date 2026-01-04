import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Csv from './pages/Csv'

import LenisScroll from './components/lenis-scroll'
import Table from './pages/Table'
import { Routes } from 'react-router'
import { Route } from 'react-router'
import Api from './pages/Api'
function App() {
  const handleFinishedAnalysis = (data) => {
    console.log("Analysis received:", data);
  };

  return (
    <div>
      
        <LenisScroll />
        <Navbar />
        <Routes>
          <Route path="/csv" element={<Csv  onResult={handleFinishedAnalysis} />}/>
        
        <Route path="/table" element={<Table onResult={handleFinishedAnalysis} />}/>
        <Route path="/api" element={<Api onResult={handleFinishedAnalysis} />}/>
        </Routes>
      
        
     
    </div>
  );
}

export default App

