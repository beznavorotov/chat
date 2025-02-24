import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Chat from './Pages/Chat/Chat';
import Auth from './Pages/Auth/Auth';
import Register from './Pages/Register/Register'; 

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/chat" /> : <Auth />} />
                <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />
                <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
