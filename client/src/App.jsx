import { useEffect, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import LeftSidebar from './components/leftSidebar/sidebar';
import ChatSection from './components/Chatsection/ChatSection';
import RightSidebar from './components/rightSidebar/Rightsidebar';
import AuthForm from './AuthForm';
import RegisterForm from './RegisterForm';
function AuthCheck({ Login, children }) {
  return Login ? children : <Navigate to="/login" />;
}

function App() {
  const [count, setCount] = useState(0);
  const [activeChat, setActiveChat] = useState(null);
  const socket = useRef(null);
  const allMessages = useRef([]);
  const contacts = useRef([]);
  const groups = useRef([])
  const groupMessages = useRef([])
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
        allMessages.current = payload.directMessages;
        contacts.current = payload.contacts;
        groups.current = payload.groups
        groupMessages.current = payload.groupMessages
        console.log('Messages:', allMessages.current);
        console.log('Contacts:', contacts.current);
      }
    };
  }, []);

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/login"
          element={<AuthForm setLogin={setislogin} />}
        />


        <Route
          path="/*"
          element={
            <AuthCheck Login={islogin} setLogin={setislogin}>
              <div className="body">
                <LeftSidebar
                  allMessages={allMessages.current}
                  contacts={contacts.current}
                  groups={groups.current}
                  groupMessages={groupMessages.current}
                  onSelectContact={(c) => setActiveChat(c)}
                />
                <ChatSection
                  activeChat={activeChat}
                  allMessages={allMessages.current}
                  socket={socket.current}
                  groupMessages={groupMessages.current}
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
