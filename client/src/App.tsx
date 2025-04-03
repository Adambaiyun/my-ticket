import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<EventList />} />
      <Route path="/event/:id" element={<EventDetail />} />
    </Routes>
  </Router>
);

export default App;