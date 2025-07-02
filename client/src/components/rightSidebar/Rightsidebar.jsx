import { useEffect, useState } from "react";
import ProfileImg from "./Profile";
import axios from "axios";
import "./Rightsidebar.css";
import ProfileInfo from "./ProfileInfo";
import { useNavigate } from 'react-router-dom';

export default function Rightsidebar() {
  const [img, setImg] = useState("");
  const [profileInfo, setProfileInfo] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/authentication/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    axios.get('http://localhost:3000/user/api/profile-pic', { withCredentials: true })
      .then(response => {
        console.log("profile info", response.data);
        setImg(response.data.profilePic);
        setProfileInfo(response.data.username);
      })
      .catch(err => console.error("Failed to load profile pic", err));
  }, []);

  return (
    <div className="rightSidebar">
      <ProfileImg img={img} />
      <ProfileInfo profileInfo={profileInfo} />
      <div className="logout-button" onClick={handleLogout}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 16L21 12L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Logout</span>
      </div>
    </div>
  );
}
