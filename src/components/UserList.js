import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const UserList = () => {
  const [users, setUsers] = useState([]);
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
            const isCurrent = currentUser && currentUser.uid === user.uid;
            const displayName = (user.firstName && user.lastName)
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

export default React.memo(UserList);
