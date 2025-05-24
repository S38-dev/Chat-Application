import { useEffect, useRef, useState } from "react"
import ProfileImg from "./Profile"
import axios from "axios";
import "./Rightsidebar.css"
import ProfileInfo from "./ProfileInfo"


export default function Rightsidebar(){
const [img, setImg] = useState("");
const[profileInfo,setProfileInfo]=useState('');

useEffect(() => {
  axios.get('http://localhost:3000/user/api/profile-pic', { withCredentials: true })
    .then(response =>{console.log("profile info",response.data) ;setImg(response.data.profilePic);setProfileInfo(response.data.username)})
    .catch(err => console.error("Failed to load profile pic", err));
}, []);
    return(
        <div className="rightSidebar">
        <ProfileImg img={img}/>
        {/* <profileinfo profileInfo={profileInfo}/> */}
        <ProfileInfo profileInfo={profileInfo}/>
        

        </div>


    )
}