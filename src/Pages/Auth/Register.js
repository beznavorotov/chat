import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const register = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Паролі не співпадають!');
            return;
        }

        setLoading(true);
        try {
            // Створення користувача в Firebase Auth
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Оновлення профілю користувача
            await updateProfile(result.user, {
                displayName: `${name}`,
            });

            // Запис користувача в Firestore
            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid,
                name,
                email
            });

            // Збереження в localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: result.user.uid,
                name,
                email
            }));

            toast.success('Акаунт створено!');
            navigate('/chat');
        } catch (error) {
            console.error('Помилка реєстрації:', error);
            toast.error('Не вдалося зареєструватися. Спробуйте ще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Реєстрація</h1>
            <form onSubmit={register}>
                <input 
                    type="text" 
                    placeholder="Нікнейм" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
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
                <input 
                    type="password" 
                    placeholder="Підтвердити пароль" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                />
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Завантаження...' : 'Зареєструватися'}
                </button>
            </form>
            <button onClick={() => navigate('/')} className="auth-link">
                Вже маєте акаунт? Увійти
            </button>
        </div>
    );
};

export default Register;
