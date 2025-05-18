import { useRef } from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function ProfileImg({ img }) {
    const [profile, setprofile] = useState(img);
    const [preview, setpreview] = useState("")
    const [displayStyle, setdisplayStyle] = useState("none")

    let file = useRef('');
    function ProfileChange(e) {
        file.current = e.target.files[0]
        if (file.current) {
            const reader = new FileReader();
            reader.readAsDataURL(file.current);
            reader.onload = function (e) {
                setpreview(e.target.result)
                console.log("base url ", e.target.result)
                setdisplayStyle("block")
            };
        }
    }
    function submitProfile(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("profile_pic", file.current);
        axios.post('/profile/edit/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

    }




    return (
        <form className="profile" id="profile_img" onSubmit={(e) => { submitProfile(e) }}>
            <img src={preview} id="profile-preview" style={{ display: displayStyle }} />
            <input type="file" id="profileImg" onChange={(e) => ProfileChange(e)} />
            <label htmlFor="profileImg">Edit</label>
            <input type="submit" value="upload" id="upload" />
        </form>
    )

}