import { useEffect, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AddgroupPage from './components/leftSidebar/AddgroupPage';
import LeftSidebar from './components/leftSidebar/sidebar';
import ChatSection from './components/Chatsection/Chatsection';
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
  const [allMessages, setAllMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [islogin, setislogin] = useState(false);
  const[currentUser,setcurrentUser]=useState(null);
  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:3000/ws');

    socket.current.onopen = function () {
      console.log('Connection open!');
      if (socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify({ type: 'fetch' }));
      } else {
        console.warn("Socket not ready to send");
      }
    };

    socket.current.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.type === 'fetched_messages') {
        setAllMessages(payload.directMessages);
        setContacts(payload.contact);
        setcurrentUser(payload.user)
        console.log("payload.user",payload.user)

        setGroups(payload.groups);
        setGroupMessages(payload.groupMessages);

      }
      else if (payload.type === 'direct') {
        setAllMessages(prev => [...prev, payload.message]);
      }
      else if (payload.type === 'group') {
        setGroupMessages(prev => [...prev, payload.message]);
      }
    };
  }, [islogin]);

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/login"
          element={<AuthForm setLogin={setislogin} />}
        />
        <Route
          path="/addGroupLink"
          element={
            <AuthCheck Login={islogin}>
              <AddgroupPage />
            </AuthCheck>
          }
        />





        <Route
          path="/*"
          element={
            <AuthCheck Login={islogin} setLogin={setislogin}>
              jsx
              <div className="body" style={{
                height: '100vh',
                width: '100vw',
                overflow: 'hidden'
              }}>
                <LeftSidebar
                  allMessages={allMessages}
                  contacts={contacts}
                  groups={groups}
                  groupMessages={groupMessages}
                  currentUser={currentUser}
                  onSelectContact={(c) => setActiveChat(c)}
                />
                <ChatSection
                  activeChat={activeChat}
                  allMessages={allMessages}
                  socket={socket.current}
                  groupMessages={groupMessages}
                  currentUser={currentUser}
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
