import React, { useState, useEffect } from "react";
import { auth, provider, db } from "../../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Оновлення статусу користувача
  const updateUserStatus = async (user, status) => {
    if (!user) return;
    await setDoc(
      doc(db, "users", user.uid),
      { status },
      { merge: true }
    );
  };

  // Видалення користувача при закритті вкладки
  useEffect(() => {
    const handleBeforeUnload = async () => {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, "users", user.uid));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const [firstName, lastName] = user.displayName?.split(" ") || [
        "Користувач",
        "",
      ];
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          firstName,
          lastName,
          email: user.email,
          status: "online",
        });
      } else {
        await updateUserStatus(user, "online");
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          firstName,
          lastName,
          email: user.email,
        })
      );

      toast.success(`Вітаємо, ${user.displayName}!`);
      navigate("/chat");
    } catch (error) {
      console.error("Помилка входу через Google:", error);
      toast.error("Не вдалося увійти. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmailPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);
      let userData = {
        uid: result.user.uid,
        email: result.user.email,
        firstName: "Користувач",
        lastName: "",
        status: "online",
      };

      if (userSnap.exists()) {
        userData = { ...userData, ...userSnap.data() };
        await updateUserStatus(result.user, "online");
      }

      localStorage.setItem("user", JSON.stringify(userData));
      toast.success(`Вітаємо, ${userData.firstName} ${userData.lastName}!`);
      navigate("/chat");
    } catch (error) {
      console.error("Помилка входу:", error);
      toast.error("Не вдалося увійти. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>CHAT BEZNAVOROTOV</h1>
      <div className="auth-border">
        <h2>Sing In With</h2>

        <button onClick={signInWithGoogle} className="login-with-google-btn">
          Увійти через Google
        </button>

        <form onSubmit={signInWithEmailPassword} className="auth-form">
          <input
            className="auth-input"
            type="email"
            placeholder="Електронна пошта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="button-79" disabled={loading}>
            {loading ? "Завантаження..." : "Увійти"}
          </button>
        </form>

        <button
          onClick={() => navigate("/register")}
          className="auth-link button-6"
        >
          Зареєструватися
        </button>
      </div>
    </div>
  );
};

export default Auth;