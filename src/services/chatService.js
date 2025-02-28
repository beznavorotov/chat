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

// Видаляємо користувача з Firestore при виході
export const removeUserFromFirestore = async () => {
  let currentUser = auth.currentUser || JSON.parse(localStorage.getItem("user"));
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  await deleteDoc(userRef);
  localStorage.removeItem("user");
  await auth.signOut();
};

// Оновлюємо статус користувача як "offline"
export const setUserOffline = async () => {
  let currentUser = auth.currentUser || JSON.parse(localStorage.getItem("user"));
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  await updateDoc(userRef, { status: "offline", lastActive: Date.now() });
};

// Видаляємо неактивних користувачів через 5 хвилин
export const removeInactiveUsers = async () => {
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
};

// **Підписка на список користувачів**
export const subscribeToUsers = (setUsers) => {
  return onSnapshot(collection(db, "users"), (snapshot) => {
    const userList = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
    setUsers(userList);
  });
};

// **Підписка на повідомлення**
export const subscribeToMessages = (setMessages) => {
  return onSnapshot(collection(db, "messages"), (snapshot) => {
    const messageList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    messageList.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    setMessages(messageList);
  });
};

// **Відправка повідомлення**
export const sendMessage = async (message) => {
  if (!message.trim()) return;

  const newMessage = {
    text: message,
    timestamp: new Date().toISOString(),
    user: auth.currentUser.displayName || "Анонім",
    uid: auth.currentUser.uid,
  };

  await addDoc(collection(db, "messages"), newMessage);
};
