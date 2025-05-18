import { useRef } from "react"

function Rightsidebar(){
   const Img=useRef('')
   const profileInfo=useRef('')
   useEffect(() => {
    axios.get('/api/profile-pic')
      .then(response => {
      Img.current = response.data.profilePic;
       
      })
      .catch(err => console.error("Failed to load profile pic", err));
  }, []);
    return(
        <>
        <Profile ProfileImg={Img}/>
        <profileinfo profileInfo={profileInfo}/>

        </>


    )
}