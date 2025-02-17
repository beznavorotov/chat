import React from 'react';

const UserList = ({ users }) => (
    <div className="user-list">
        <h2>Користувачі в чаті ({users.length})</h2>
        <ul>
            {users.map((user, index) => (
                <li key={index}>{user}</li>
            ))}
        </ul>
    </div>
);

export default UserList;
