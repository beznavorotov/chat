import React, { useState } from 'react';
import { auth, provider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css';

const Auth = () => {
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            localStorage.setItem('user', JSON.stringify(result.user));
            toast.success(`Вітаємо, ${result.user.displayName}!`);
        } catch (error) {
            console.error('Помилка авторизації:', error);
            toast.error('Не вдалося увійти. Спробуйте ще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Авторизація</h1>
            <button onClick={signIn} className="auth-button" disabled={loading}>
                {loading ? 'Завантаження...' : 'Увійти через Google'}
            </button>
        </div>
    );
};

export default Auth;
