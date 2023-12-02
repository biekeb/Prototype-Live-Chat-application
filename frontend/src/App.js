import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); 

function App() {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

useEffect(() => {
  socket.on('connect', () => {
    console.log(`Connected to server with ID: ${socket.id}`);
  });
}, [socket]);



  useEffect(() => {
    const username = prompt('Enter your username:');
    setUsername(username);
    socket.emit('join', username);

    socket.on('updateUsers', (users) => {
      setUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const data = {
      username,
      message,
    };
    socket.emit('message', data);
    setMessages([...messages, data]);
    setMessage('');
  };

  useEffect(() => {
  socket.emit('getAvailableUsers');

  socket.on('updateAvailableUsers', (users) => {
    setAvailableUsers(users);
  });
}, [socket]);




  socket.on('message', (data) => {
    setMessages([...messages, data]);
  });
  

  const handleUserSelection = (selectedUser) => {
  // Hier kun je een nieuwe chatroom maken met de geselecteerde gebruiker
  // en navigeren naar de chatroompagina, of de chatinterface updaten
  // om met de geselecteerde gebruiker te communiceren.
  console.log(`Selected user: ${selectedUser}`);
};


  return (
    <div>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Chat</h2>
        <div style={{ border: '1px solid #ccc', padding: '10px', height: '200px', overflowY: 'scroll' }}>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h2>Available Users</h2>
        <ul>
          {availableUsers.map((user) => (
            <li key={user} onClick={() => handleUserSelection(user)}>
              {user}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default App;
