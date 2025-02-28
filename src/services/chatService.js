import { db, auth } from "../firebase";
import {
  collection,
  setDoc,
  getDoc,
  doc,
  onSnapshot,
  deleteDoc,
  writeBatch,
  addDoc,
  updateDoc, // Додано
} from "firebase/firestore";

// Додаємо користувача в Firestore з онлайн-статусом
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
    });
  } else {
    await updateDoc(userRef, { status: "online" });
  }
};

// Видаляємо користувача повністю з Firestore при виході
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
  await updateDoc(userRef, { status: "offline" });
};

export const subscribeToUsers = (setUsers) => {
  return onSnapshot(collection(db, "users"), (snapshot) => {
    const userList = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
    setUsers(userList);
  });
};

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

export const sendMessage = async (message) => {
  if (!message.trim()) return;

  const newMessage = {
    text: message,
    timestamp: new Date().toISOString(),
    user: auth.currentUser.displayName || "Анонім",
  };

  await addDoc(collection(db, "messages"), newMessage);
};

export const deleteMessage = async (id) => {
  await deleteDoc(doc(db, "messages", id));
};

export const clearChat = async (messages) => {
  const batch = writeBatch(db);
  messages.forEach((msg) => {
    const msgRef = doc(db, "messages", msg.id);
    batch.delete(msgRef);
  });
  await batch.commit();
};
