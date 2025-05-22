import { useEffect, useRef, useState } from "react"
import ProfileImg from "./Profile"
import axios from "axios";
import "./Rightsidebar.css"



export default function Rightsidebar(){
const [img, setImg] = useState("");

useEffect(() => {
  axios.get('http://localhost:3000/user/api/profile-pic', { withCredentials: true })
    .then(response =>{console.log(response.data) ;setImg(response.data.profilePic)})
    .catch(err => console.error("Failed to load profile pic", err));
}, []);
    return(
        <div className="rightSidebar">
        <ProfileImg img={img}/>
        {/* <profileinfo profileInfo={profileInfo}/> */}

        </div>


    )
}