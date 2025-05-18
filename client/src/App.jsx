import { useEffect, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import LeftSidebar from './LeftSidebar';
import ChatSection from './ChatSection';
import RightSidebar from './RightSidebar';
import AuthForm from './AuthForm';

function AuthCheck({ Login, children }) {
  return Login ? children : <Navigate to="/login" />;
}

function App() {
  const [count, setCount] = useState(0);
  const [activeChat, setActiveChat] = useState(null);
  const socket = useRef(null);
  const allMessages = useRef('');
  const contacts = useRef('');
  const groups=useRef('')
  const [islogin, setislogin] = useState(false);
  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:3000');

    socket.current.onopen = function () {
      console.log('Connection open!');
      socket.current.send(JSON.stringify({ type: 'fetch' }));
    };

    socket.current.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.type === 'fetched_messages') {
        allMessages.current = payload.messages;
        contacts.current = payload.contacts;
        groups.current=payload.current
        console.log('Messages:', allMessages.current);
        console.log('Contacts:', contacts.current);
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route
          path="/*"
          element={
            <AuthCheck Login={islogin}>
              <div className="body">
                <LeftSidebar
                  allMessages={allMessages.current}
                  contacts={contacts.current}
                  groups={groups.current}
                  onSelectContact={(c) => setActiveChat(c)}
                />
                <ChatSection
                  activeChat={activeChat}
                  allMessages={allMessages.current}
                  socket={socket.current}
                />
                <RightSidebar />
              </div>
            </AuthCheck>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
