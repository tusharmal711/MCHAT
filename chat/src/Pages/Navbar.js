import { NavLink} from "react-router-dom";
import { ImCamera } from "react-icons/im";
import { SiEventstore } from "react-icons/si";
import { TbFriends } from "react-icons/tb";
import { BiSolidPhoneCall } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { TiArrowLeftThick } from "react-icons/ti";
import { TbInfoSquareRoundedFilled } from "react-icons/tb";
import { IoSettingsSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdChat } from "react-icons/md";
import { HiOutlineEye } from "react-icons/hi";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
const Navbar = ()=>{
   const navigate=useNavigate();
 const [isOpen, setIsOpen] = useState(false); // Popup state
 const [navProfile,setNavProfile]=useState(false);
 const [you,setYou]=useState([]);
 const [isHovered, setIsHovered] = useState(false);
//  const [showpopup,setShowPopup]=useState(false);
 const [showUpload,setShowUpload]=useState(false);
 const [view,setView]=useState(false);
   // const sendData = () => {
   //    setNavProfile(true);
   //    navigate("/chatboard", { state: {isOpen : true} });
   //  };


   
    useEffect(() => {
       const fetchContacts = async () => {
       
         try {
           const phone = sessionStorage.getItem("phone");
           const res = await fetch("http://localhost:3001/api/fetchYou", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ phone }),
           });
   
           if (!res.ok) throw new Error("Failed to fetch contacts");
           const data = await res.json();
           setYou(data);
         } catch (error) {
           console.error("Error fetching contacts:", error);
         }
       };
   
       fetchContacts();
     }, []);

     const profilePic = document.querySelector(".profile-pic");
     const uploadPopup = document.querySelector(".upload-popup");
     const navProfile1=document.querySelector(".profile-scroll");
const showPopup=()=>{
  
setShowUpload(false);




if (profilePic && uploadPopup) {
    profilePic.classList.toggle("profile-opacity");
    uploadPopup.classList.toggle("fold");
    navProfile1.classList.toggle("overflow");
   
} else {
    console.error("Element not found: profilePic or uploadPopup");
}
 
}

const viewProfile = ()=>{
  setView(true);
  uploadPopup.classList.remove("fold");
  profilePic.classList.remove("profile-opacity");
  navProfile1.classList.remove("overflow");
}




   return <div className="navbar">
{/* view photo part is starting from here */}

{
  view && (
<div className="photo-overlay">
<div className="photo-nav">

<div className="left-nav">
<img src="./Images/tush-profile.jpg"  alt="Profile" />
<p>You</p>
</div>


<div className="right-nav" onClick={()=>{setView(false)}}>
<RxCross2 id="right-cross"/>
</div>


</div>


<div className="view-photo">
<img src="./Images/tush-profile.jpg"  alt="Profile" />
</div>

</div>

  )
}



{/* view photo part is ending here */}

{/* Logout Popup */}
{isOpen && (
        <div className="popup-overlay">
          <div className="logout-popup">
            <div className="popup-text">
              <h3>Logout?</h3>
              <p>Are you sure you want to logout?</p>
              <p id="see">See you next time! Click 'Logout' to confirm.</p>
            </div>
            <div className="popup-button">
              <button type="button" id="logoutCancel" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button id="logoutBtn" onClick={() => navigate("/login")}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    





  {
   navProfile &&(
      <div className="nav-profile">
         <TiArrowLeftThick  onClick={()=>{setNavProfile(false)}} id="left-arrow"/>
        
      <div className="heading-part">
      <h2 id="chat-heading">Profile</h2>
      </div>


      <div className="profile-scroll">
       

    
  

     <div className="profile-pic" id="profile-pic">

     <img src="./Images/tush-profile.jpg"  className="profile-pic-img" id="profile-pic-img" onClick={showPopup}   onMouseEnter={() => setIsHovered(true)}  onMouseLeave={() => setIsHovered(false)} alt="Profile" />
     </div>


     <div className="change-profile">
    {
      ((isHovered && !showUpload) || (!isHovered && showUpload) || (isHovered && showUpload))&&(
        <p id="pic-text"> <ImCamera id="profile-camera"/><br></br>CHANGE <br></br>PROFILE PHOTO</p>
      )
    }
    
        
      </div>


     
    <div className="upload-popup" id="upload-popup">
    <ul>
      <li  onClick={viewProfile}>
      <HiOutlineEye id="up"/> View photo
      </li>
      <li>
      <MdOutlinePhotoCamera id="up"/> Take photo
     
      </li>
      <label for="file-input">
      <li>
        <MdOutlineDriveFolderUpload id="up"/> Upload photo
        <input type="file" id="file-input" accept="image/*"/> 
      </li>
      </label>
      <li>
      <RiDeleteBin6Line id="up"/> Remove photo
      </li>
    </ul>
  </div>

   

  












     
     {
      you.map((profile)=>(
        <div key={profile.id}>
          <h2>{profile.username}</h2>
          <p id="your-mobile">+91 {profile.phone}</p>



          <div className="p-t-z pt">
          <div>
          <MdEmail className="email-icon"/>
          </div>
        <div className="ptContent">
        <span>Email</span>
        <span>{profile.email}</span>
       
        </div>

       
      </div>





        </div>
      ))
     }








         
      <div className="profile-text">
        

      <div className="p-t-f pt">
        <div> <TbInfoSquareRoundedFilled id="about-icon"/></div>
        <div className="ptContent">
        <span>About</span>
        <span>This is my about</span>
        </div>
        <div className="edit-icon"> <FaEdit id="edit-icon"/></div>
     
       
       
      </div>



      <div className="p-t-s pt">
        <IoSettingsSharp id="setting-icon"/>
        <span>Settings</span>
      
      </div>


      </div>

      </div>


  </div>
   )
  }
      
  










   <img src="./Images/image.png" id="profile-default" alt="Not found" onClick={()=>{setNavProfile(true)}}/>
    <NavLink to="/chatboard" className="link chat"><MdChat /></NavLink>
    <NavLink to="/moments" className="link moments"><SiEventstore /></NavLink>
    <NavLink to="/connect" className="link connect"><TbFriends /></NavLink>
    <NavLink to="/calls" className="link calls"><BiSolidPhoneCall /></NavLink>
    {/* <NavLink to="#" id="logout" className="link logout" onClick={sendData}><IoLogOut /></NavLink> */}

    <button id="logout" className="link logout" onClick={()=>{setIsOpen(true)}}>
        <IoLogOut />
      </button>







   </div>
}
export default Navbar;