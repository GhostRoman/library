import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path='/books' element={<BookList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/book/:id" element={<BookDetails />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
