import { db, auth } from "../firebase";
import {
  collection,
  setDoc,
  getDoc,
  getDocs,
  doc,
  onSnapshot,
  deleteDoc,
  addDoc,
  updateDoc,
  writeBatch // Імпортуємо writeBatch для clearChat
} from "firebase/firestore";

// Додаємо користувача в Firestore
export const addUserToFirestore = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      uid: currentUser.uid,
      name: currentUser.displayName || "Анонім",
      status: "online",
      lastActive: Date.now(),
    });
  } else {
    await updateDoc(userRef, { status: "online", lastActive: Date.now() });
  }
};

// Видаляємо повідомлення за ID
export const deleteMessage = async (id) => {
  try {
    await deleteDoc(doc(db, "messages", id));
  } catch (error) {
    console.error("Помилка видалення повідомлення:", error);
  }
};

// Очищення всіх повідомлень у чаті
export const clearChat = async (messages) => {
  try {
    const batch = writeBatch(db);
    messages.forEach((msg) => {
      const msgRef = doc(db, "messages", msg.id);
      batch.delete(msgRef);
    });
    await batch.commit();
  } catch (error) {
    console.error("Помилка очищення чату:", error);
  }
};

// Видаляємо користувача з Firestore при виході
export const removeUserFromFirestore = async () => {
  try {
    const currentUser = auth.currentUser || JSON.parse(localStorage.getItem("user"));
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    await deleteDoc(userRef);
    localStorage.removeItem("user");
    await auth.signOut();
  } catch (error) {
    console.error("Помилка видалення користувача:", error);
  }
};

// Оновлюємо статус користувача як "offline"
export const setUserOffline = async () => {
  try {
    const currentUser = auth.currentUser || JSON.parse(localStorage.getItem("user"));
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { status: "offline", lastActive: Date.now() });
  } catch (error) {
    console.error("Помилка встановлення статусу offline:", error);
  }
};

// Видаляємо неактивних користувачів через 5 хвилин
export const removeInactiveUsers = async () => {
  try {
    const offlineTime = 5 * 60 * 1000; // 5 хвилин
    const now = Date.now();
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    snapshot.forEach(async (docSnap) => {
      const userData = docSnap.data();
      if (userData.status === "offline" && now - userData.lastActive > offlineTime) {
        await deleteDoc(doc(db, "users", userData.uid));
      }
    });
  } catch (error) {
    console.error("Помилка видалення неактивних користувачів:", error);
  }
};

// **Підписка на список користувачів**
export const subscribeToUsers = (setUsers) => {
  try {
    return onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    });
  } catch (error) {
    console.error("Помилка підписки на користувачів:", error);
  }
};

// **Підписка на повідомлення**
export const subscribeToMessages = (setMessages) => {
  try {
    return onSnapshot(collection(db, "messages"), (snapshot) => {
      const messageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      messageList.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(messageList);
    });
  } catch (error) {
    console.error("Помилка підписки на повідомлення:", error);
  }
};

// **Відправка повідомлення**
export const sendMessage = async (message) => {
  try {
    const currentUser = auth.currentUser;
    if (!message.trim() || !currentUser) return;

    const newMessage = {
      text: message,
      timestamp: new Date().toISOString(),
      user: currentUser.displayName || "Анонім",
      uid: currentUser.uid,
    };

    await addDoc(collection(db, "messages"), newMessage);
  } catch (error) {
    console.error("Помилка відправлення повідомлення:", error);
  }
};
