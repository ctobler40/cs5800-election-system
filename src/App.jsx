import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react'

// Navbar and Footer
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';

// Designs
import './App.css';

// Pages
import MainPage from './pages/MainPage';
import Votes from './pages/Votes';
import Results from './pages/Results';
import Candidates from './pages/Candidates';
import VoteNow from './pages/VoteNow';
import Account from './pages/Account';
import Login from './components/Login';
import FetchRequests from './components/FetchRequests';
import Register from './components/Register';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ContactUs from './pages/ContactUs';
import ReportGeneration from './pages/ReportGeneration'; // Import the new ReportGeneration page
import PendingRequest from './pages/request/PendingRequest';

function App() {
  return (
    <div className='App'>
      <br />
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route index element={<MainPage />} />
          <Route path='/votes' element={<Votes />} />
          <Route path='/results' element={<Results />} />
          <Route path='/candidates' element={<Candidates />} />
          <Route path='/my-vote' element={<VoteNow />} />
          <Route path='/account' element={<Account />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/contactUs' element={<ContactUs />} />
          <Route path='/report-generation' element={<ReportGeneration />} /> {/* New route for ReportGeneration */}
          <Route path="/pending-request" element={<PendingRequest />} />
          <Route path="/need-request" element={<FetchRequests />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
      <br />
    </div>
  )
}

export default App
