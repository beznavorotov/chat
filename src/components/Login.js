// import React, { useState } from 'react';
// import { auth, signInWithEmailAndPassword, signInWithPopup, provider } from '../firebase';
// import { useNavigate } from 'react-router-dom';
// import './Auth.css';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             await signInWithEmailAndPassword(auth, email, password);
//             navigate('/chat');
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     const handleGoogleSignIn = async () => {
//         try {
//             await signInWithPopup(auth, provider);
//             navigate('/chat');
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     return (
//         <div className="auth-container">
//             <h1>Вхід</h1>
//             <div className="form-login">
//             {error && <p className="error">{error}</p>}
//             <form onSubmit={handleLogin}>
//                 <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                 <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
//                 <button type="submit">Увійти</button>
//             </form>
//             </div>
//             <button onClick={handleGoogleSignIn} className="google-signin">Увійти через Google</button>
//         </div>
//     );
// };

// export default Login;
