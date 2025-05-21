import { useEffect, useRef, useState } from "react"
import ProfileImg from "./Profile"
import axios from "axios";
export default function Rightsidebar(){
const [img, setImg] = useState("");

useEffect(() => {
  axios.get('http://localhost:3000/user/api/profile-pic')
    .then(response => setImg(response.data.profilePic))
    .catch(err => console.error("Failed to load profile pic", err));
}, []);
    return(
        <>
        <ProfileImg Img={img}/>
        {/* <profileinfo profileInfo={profileInfo}/> */}

        </>


    )
}