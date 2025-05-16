import { useState,useEffect } from "react";

function ProfileImg(img){
 const [profile, setprofile] = useState("");

 useEffect(() => {
    setProfile(img);
  }, [img]);

  Edit=()=>{
     
  }  

    return(
      <div classname="profile" id="profile_img">
       <input type="file" id="profileImg" onChange={(e)=>ProfileImg(e.target)}/>
       <div id="edit" onClick={Edit}>edit</div>
      </div>
    )

}