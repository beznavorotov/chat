import React, { useState } from 'react';
import { auth, provider, db } from '../../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            // Отримуємо ім'я та прізвище з Google
            const [firstName, lastName] = user.displayName?.split(' ') || ['Користувач', ''];
    
            // Перевіряємо, чи користувач вже є в Firestore
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
    
            if (!userSnap.exists()) {
                // Записуємо користувача в Firestore, якщо його ще немає
                await setDoc(userRef, {
                    uid: user.uid,
                    firstName,
                    lastName,
                    email: user.email
                });
            }
    
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                firstName,
                lastName,
                email: user.email
            }));
    
            toast.success(`Вітаємо, ${user.displayName}!`);
            navigate('/chat');
        } catch (error) {
            console.error('Помилка входу через Google:', error);
            toast.error('Не вдалося увійти. Спробуйте ще раз.');
        } finally {
            setLoading(false);
        }
    };

    const signInWithEmailPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);

            // Отримуємо ім'я та прізвище з Firestore
            const userRef = doc(db, 'users', result.user.uid);
            const userSnap = await getDoc(userRef);
            let userData = {
                uid: result.user.uid,
                email: result.user.email,
                firstName: 'Користувач',
                lastName: ''
            };

            if (userSnap.exists()) {
                userData = { ...userData, ...userSnap.data() };
            }

            localStorage.setItem('user', JSON.stringify(userData));
            toast.success(`Вітаємо, ${userData.firstName} ${userData.lastName}!`);
            navigate('/chat');
        } catch (error) {
            console.error('Помилка входу:', error);
            toast.error('Не вдалося увійти. Спробуйте ще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Вхід</h1>
            <form onSubmit={signInWithEmailPassword}>
                <input 
                    type="email" 
                    placeholder="Електронна пошта" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Пароль" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Завантаження...' : 'Увійти'}
                </button>
            </form>
            <button onClick={signInWithGoogle} className="google-signin">Увійти через Google</button>
            <button onClick={() => navigate('/register')} className="auth-link">
                Зареєструватися
            </button>
        </div>
    );
};

export default Auth;
