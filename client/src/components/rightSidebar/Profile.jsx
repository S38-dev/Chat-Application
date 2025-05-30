import { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./Profileimg.css"
export default function ProfileImg({ img }) {
  const [preview, setpreview] = useState("");
  const [displayStyle, setdisplayStyle] = useState("none");
  const file = useRef(null);

  useEffect(() => {
    if (img) {
      console.log("img", img);
      setpreview(`http://localhost:3000${img}`);
      setdisplayStyle("block");
    }
  }, [img]);

  function ProfileChange(e) {
    file.current = e.target.files[0];
    if (file.current) {
      const reader = new FileReader();
      reader.readAsDataURL(file.current);
      reader.onload = function (e) {
        setpreview(e.target.result);
        console.log("base64 preview:", e.target.result);
        setdisplayStyle("block");
      };
    }
  }

  function submitProfile(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile_pic", file.current);
    axios.post('http://localhost:3000/user/profile/edit/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    }).then(res => {
      if (res.data && res.data.user && res.data.user.profile_pic) {
        setpreview(`http://localhost:3000/uploads/${res.data.user.profile_pic}`);
        alert("Profile picture uploaded successfully!");
      }
    });
  }

  return (
    <form className="profile-form" id="profile_img" onSubmit={submitProfile}>
      <img
        src={preview || "http://localhost:3000/img/default-avatar.jpeg"}
        id="profile-preview"
        style={{ display: displayStyle, width: "100px" }}
        alt="Profile Preview"
        className="profile-preview"
      />
      <input type="file" id="profileImg" onChange={ProfileChange} />
      <label htmlFor="profileImg">Edit</label>
      <input type="submit"  className="upload-button" value="Upload" id="upload" />
    </form>
  );
}
