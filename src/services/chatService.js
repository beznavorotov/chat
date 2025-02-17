import { db, auth } from '../firebase';
import { collection, setDoc, getDoc, doc, onSnapshot, query, where, getDocs, deleteDoc, writeBatch, addDoc } from 'firebase/firestore';

// Додає користувача в Firestore (унікальність за UID)
export const addUserToFirestore = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        await setDoc(userRef, {
            uid: currentUser.uid,
            name: currentUser.displayName || 'Анонім'
        });
    }
};

// Видаляє користувача з Firestore
export const removeUserFromFirestore = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userQuery = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
    const userSnapshot = await getDocs(userQuery);

    userSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });

    await auth.signOut();
};

// Отримує список користувачів у чаті (live updates)
export const subscribeToUsers = (setUsers) => {
    return onSnapshot(collection(db, 'users'), (snapshot) => {
        const userList = snapshot.docs.map(doc => doc.data().name);
        setUsers(userList);
    });
};

// Отримує повідомлення (live updates)
export const subscribeToMessages = (setMessages) => {
    return onSnapshot(collection(db, 'messages'), (snapshot) => {
        const messageList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        messageList.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(messageList);
    });
};

// Відправляє повідомлення
export const sendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
        text: message,
        timestamp: new Date().toISOString(),
        user: auth.currentUser.displayName || 'Анонім',
    };

    await addDoc(collection(db, 'messages'), newMessage);
};

// Видаляє конкретне повідомлення
export const deleteMessage = async (id) => {
    await deleteDoc(doc(db, 'messages', id));
};

// Очищає чат
export const clearChat = async (messages) => {
    const batch = writeBatch(db);
    messages.forEach((msg) => {
        const msgRef = doc(db, 'messages', msg.id);
        batch.delete(msgRef);
    });
    await batch.commit();
};
