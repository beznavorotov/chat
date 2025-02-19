import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const UserList = () => {
    const [users, setUsers] = useState([]);
    // Зчитуємо поточного користувача з localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const userList = snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="user-list">
            <h2>Користувачі в чаті ({users.length})</h2>
            {users.length > 0 ? (
                <ul>
                    {users.map((user) => {
                        // Якщо користувач у Firestore співпадає з поточним, виділяємо його
                        const isCurrent = currentUser && currentUser.uid === user.uid;
                        // Визначаємо ім'я користувача: якщо є firstName/lastName, комбінуємо їх, інакше використовуємо user.name
                        const displayName = user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.name || 'Без імені';
                        return (
                            <li key={user.uid}>
                                {isCurrent ? <strong>{displayName} (Ви)</strong> : displayName}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="empty-list">Немає активних користувачів</p>
            )}
        </div>
    );
};

export default UserList;
