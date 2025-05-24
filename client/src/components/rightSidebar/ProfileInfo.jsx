
import './ProfileInfo.css';
export default function ProfileInfo({profileInfo}){
    return(
        <>
        <div class="profile-info">
            <p>
                <b>
                    
                    {profileInfo}
                </b>
            </p>
           

        </div>
         <hr />
        </>
    )

}