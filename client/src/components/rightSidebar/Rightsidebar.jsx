import { useRef } from "react"
import ProfileImg from "./Profile"
export default function Rightsidebar(){
const [img, setImg] = useState("");

useEffect(() => {
  axios.get('/api/profile-pic')
    .then(response => setImg(response.data.profilePic))
    .catch(err => console.error("Failed to load profile pic", err));
}, []);
    return(
        <>
        <ProfileImg Img={Img}/>
        {/* <profileinfo profileInfo={profileInfo}/> */}

        </>


    )
}