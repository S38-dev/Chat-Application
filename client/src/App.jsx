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
  const [currentUser, setcurrentUser] = useState(null);





  useEffect(() => {
    if (!islogin) return;

    const ws = new WebSocket('ws://localhost:3000/ws');
    socket.current = ws;

    ws.onopen = () => {
      console.log('Connection open!');
      ws.send(JSON.stringify({ type: 'fetch' }));


    };

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.type === 'fetched_messages') {
        setAllMessages(payload.directMessages);
        setContacts(payload.contact);
        setcurrentUser(payload.user);
        setGroups(payload.groups);
        setGroupMessages(payload.groupMessages);
      } else if (payload.type === 'direct') {
        setAllMessages(prev => [...prev, {
          message: payload.message.message,
          sender_id: payload.message.sender_id,
          receiver_id: payload.message.receiver_id,
          timestamp: payload.message.timestamp
        }]);
      } else if (payload.type === 'group') {
        setGroupMessages(prev => [...prev, payload.message]);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => {

      ws.close();
    };
  }, [islogin]);







  function sendMessage(row) {

    setAllMessages(prev => [...prev, row]);

    // socket.current.send(JSON.stringify({
    //   type: row.message_group ? "group" : "direct",
    //   message: row.message,
    //   to: row.message_group ? null : row.receiver_id,
    //   group: row.message_group
    // }));
  }
  function addingConections(row) {

    setContacts(row)
  }
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
                  socket={socket.current}
                  contacts={contacts}
                  groups={groups}
                  groupMessages={groupMessages}
                  currentUser={currentUser}
                  onSelectContact={(c) => setActiveChat(c)}
                  addingConections={addingConections}
                  Login={islogin}
                />
                <ChatSection
                  activeChat={activeChat}
                  allMessages={allMessages}
                  socket={socket.current}
                  groupMessages={groupMessages}
                  currentUser={currentUser}
                  onSend={sendMessage}
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
