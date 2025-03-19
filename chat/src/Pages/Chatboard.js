 
import React, { useState, useEffect ,useRef ,useReducer} from "react";
// import { useLocation  } from "react-router-dom";
import { MdPersonAddAlt1 } from "react-icons/md";
import { ImBlocked } from "react-icons/im";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FcDeleteDatabase } from "react-icons/fc";
import { IoMdImages } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
// import { TbInfoSquareRoundedFilled } from "react-icons/tb";
import "../CSS/Signup.css";

const socket=io.connect("http://localhost:3001");

const Chatboard = ({ user, contact}) => {
  // const navigate = useNavigate();
  // const location = useLocation();

  // State variables
  const [contacts, setContacts] = useState([]); // List of contacts
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering contacts
  const [selectedContact, setSelectedContact] = useState(null); // Selected contact details
  const [you,setYou]=useState([]);
  const [isPopup,setIsPopup]=useState(false);
  const [showIcon,setShowIcon]=useState(false);
  const [second,setSecond]=useState(false);
  const [third,setThird]=useState(false);
  
  const [activeContact, setActiveContact] = useState(null);
  const [showcontainer,setShowcontainer]=useState(true);
  const [welcome,setWelcome]=useState(true);
 
  // const [navProfile,setNavProfile]=useState(true);


    
    const [username, setUsername] = useState("");
    const [mobile, setMobile] = useState("");
  
    const [pro_uname,setPro_uname]=useState("");
// state define for chating
// const [sender,setSender]=useState("");
// const [receiver,setReceiver]=useState("");
const [userName, setUserName] = useState("");
const [chat, setChat] = useState("");
const [chats, setChats] = useState([]);
const [joined, setJoined] = useState(false);
const [room, setRoom] = useState("");

useEffect(() => {
  if (!room) return;
  
  socket.emit("join_room", room);

  socket.on("chat_history", (history) => setChats(history));
  socket.on("receive_message", (data) => {
    if (data.room === room) {
    setChats((prevChats) => [...prevChats, data]);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  return () => {
    
    socket.off("chat_history");
    socket.off("receive_message");
  };
}, [room]);

// Join chat room
// const joinRoom = (contact) => {
//   if (contact) {
//     const newRoom = [sessionStorage.getItem("phone"), selectedContact.mobile].sort().join("_");
//     setRoom(newRoom);
//     socket.emit("join_room", newRoom);
//     setJoined(true);
//   }
// };
useEffect(() => {
  if (you.length > 0) {
    setPro_uname(you[0].username); // Assuming you want the first user's username
  }
}, [you]);
// Send message


// after clicking on enter button the message will be send 

const handleKeyDown = (e) => {
  if (e.key === "Enter" && chat.trim() !== "") {
    sendMessage(chat);
    setChat(""); // Clear input after sending
  }
};


// browser notification is starting from here
useEffect(() => {
  requestPermission();
}, []);
const requestPermission = () => {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      console.log("Notification permission:", permission);
    });
  }
};

const showNotification = (chat,sender) => {
  console.log(sender);
  if (Notification.permission === "granted") {
    const audio = new Audio("./Sounds/notifications.mp3"); // Replace with your sound file
    audio.play();
    const notification=new Notification("MindChat", {
      icon: "./Images/app.png", 
      // badge:"./Images/app.png",
      body:sender+" : "+chat,
      vibrate: [200, 100, 200], // Mobile vibration pattern
      // requireInteraction: true, 
      
    });
    // notification.onclick = () => {
    //   window.open("https://localhost:3000"); // Replace with your chat URL
    // };
  }
};




// browser notification is ending from here















const phone = sessionStorage.getItem("phone");
const contactNo = sessionStorage.getItem("phone");
const sendMessage = async(req,res) => {
  
  await fetch("http://localhost:3001/api/addNewContact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({phone : selectedContact?.mobile , username : "Unknown", mobile : contactNo}),
  });
  if (!room || !chat.trim()) return;
 
  const timestamp = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST Offset in milliseconds
  const istDate = new Date(timestamp.getTime() + istOffset);
  
  // Extract hours and minutes correctly
  const hours = istDate.getUTCHours().toString().padStart(2, "0"); // Use getUTCHours()
  const minutes = istDate.getUTCMinutes().toString().padStart(2, "0"); // Use getUTCMinutes()
  
  // Final IST Time in HH:MM format
  const istTime = `${hours}:${minutes}`;
  
  console.log("IST Time:", istTime); // Debugging/// indian time
  const messageData = { userName : pro_uname , text: chat, room , timeStamp: istTime};
  socket.emit("send_message", messageData);
  setChat("");
  setShowIcon(false);
  const notUser=sessionStorage.getItem("notUser");
  showNotification(chat,notUser);
};
// chating part is ending here











   

  
    const addContact = async () => {
      await fetch("http://localhost:3001/api/addContact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({phone , username, mobile }),
      });
    //   fetchContacts();
    
      setUsername("");
      setMobile("");
     
    };
  // Fetch contacts from the backend
  const reducer = (state) => state + 1;
  const [update, forceUpdate] = useReducer(reducer, 0);
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const phone = sessionStorage.getItem("phone");
        const res = await fetch("http://localhost:3001/api/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });

        if (!res.ok) throw new Error("Failed to fetch contacts");
        const data = await res.json();
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
    const interval = setInterval(() => {
      forceUpdate(); // Triggers re-render to fetch new data
    }, 1000);

    return () => clearInterval(interval); 
  }, [update]);







  
  // Handle joining the chat room and fetching chat history
 

  // Fetch selected contact details
  const handleContactClick = async (contactId) => {
    try {
      if (!contactId) {
        console.error("Error: Invalid contact ID");
        return;
      }
  
      const res = await fetch(`http://localhost:3001/api/contact/${contactId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
  
      if (!res.ok) {
        if (res.status === 404) {
          console.error("Error: Contact not found");
          return;
        }
        throw new Error("Failed to fetch contact details");
      }
  
      const data = await res.json();
      setSelectedContact(data);
  
      // Generate unique room ID based on session phone and selected contact's mobile
      const newRoom = [sessionStorage.getItem("phone"), data.mobile].sort().join("_");
      
      // Clear previous chat history
      setChats([]);
      setTypingUser("");
  
      // Set room and join
      setRoom(newRoom);
      socket.emit("join_room", newRoom);
  
      // UI state updates
      setIsPopup(false);
      setSecond(true);
     
      setActiveContact(contactId);
      setWelcome(false);
      setJoined(true);
      
    } catch (error) {
      console.error("Error fetching contact details:", error);
    }
  };
  







  const handleContactDelete = async (contactId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/delete/${contactId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete contact");
      }
  
     
      setSecond(false);
      setThird(false);
      setIsPopup(false);
      // Update the contact list after deletion
      setContacts((prevContacts) => prevContacts.filter((c) => c._id !== contactId));
      setSelectedContact(null); // Remove selected contact after deletion
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact.");
    }
  };
  
  














//   useEffect(() => {
//     if (location.state?.navProfile) {
      
//       setShowcontainer(false);
//     }
//   }, [location.state]);


// if(navProfile){
//   setShowcontainer(false);
// }


  // Filter contacts based on search input
  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // from here this code is for typing message 
  const [typingUser, setTypingUser] = useState("");
  const typingTimeoutRef = useRef(null);


  useEffect(() => {
    socket.on("show_typing", (user) => {
      if (user !== userName) {
        setTypingUser("typing...");

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        
        typingTimeoutRef.current = setTimeout(() => setTypingUser(""), 2000);
      }
    });

    socket.on("hide_typing", () => {
      setTypingUser("");
    })
  
    return () => {
      socket.off("show_typing");
      socket.off("hide_typing");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [room]);
 useEffect(() => {
  socket.on("hide_typing", () => {
    setTypingUser(""); // Remove "Typing..." immediately
  });

  return () => socket.off("hide_typing");
}, [room]);

// end of typing part here

  const handleChange = (event) => {
    const value = event.target.value.trim();
    
    setChat(event.target.value);
    setShowIcon(value !== "");
    if (!room) return;
    
    socket.emit("typing", {room});

    // Stop typing event after 2 seconds of inactivity
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { room });
    }, 2000);
  };


  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to the latest message when chats change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]); // Runs when 'chats' updates (new message added)






  // fetching username of own
 
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
  






       const [lastMessage, setLastMessage] = useState(null);
     
       useEffect(() => {
         if (chats.length > 0) {
           setLastMessage(chats.at(-1)); // Gets the last message in chats
         }
       }, [chats]); // Runs when `chats` updates
       
       
     
    
     




  return (
    <div className="chatContainer">
      
      {
        welcome && (
          <div class="typing-text"></div>
        )
      }
    

      {/* Chat Section */}

{
  showcontainer && (
<div className="chat first">
        <div className="heading-part">
          <h2 id="chat-heading">Chats</h2>
          <MdPersonAddAlt1 id="add-contact" onClick={()=>{setShowcontainer(false)}} />
        </div>

        {/* Search Bar */}
        <div className="searchClass">
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contact..."
          />
        </div>

        {/* Contacts List */}
        <div className="chat-part">
          <ul>
            {filteredContacts.map((contact) => (
              <li key={contact._id} onClick={() => handleContactClick(contact._id)}  className={activeContact === contact._id ? "active" : ""}>
                <img src="./Images/image.png" id="dp-default" alt="Profile" />
                <div className="textChat">
                  <p id="username">{contact.username}</p>
      
                

                  {typingUser && activeContact === contact._id? (
                   <span className="typing-indicator">{typingUser}</span>
                      ) : (
                   <p id="msg">
                     {lastMessage && activeContact === contact._id &&(
                  
                      lastMessage.text
                 
                       )}
                   </p>
                       )}

                 

                        
                           
                
                  





                 
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
  )
}








{
  !showcontainer && (
<div className="chat first">
        
        <div className="heading-part">
        <h2 id="chat-heading">Add Contact</h2>
        </div>

        <div>
        <form onSubmit={addContact}>
            <div className="textarea">
            <input type="text" className="name" placeholder="Enter contact name..." onChange={(e) => setUsername(e.target.value)} required />
            <input tupe="number" className="phone" placeholder="Enter mobile number..."  onChange={(e) => setMobile(e.target.value)} required />
            </div>
           
            <div className="button">
               
                <button type="submit" id="save">Save</button>
                <button id="cancel" onClick={()=>{setShowcontainer(true)}}>Cancel</button>
            </div>
        </form>
          
       
        </div>
    
    
        
         </div>
  )
}






      














      {/* Contact Details Section */}

      {
        !third?(
          second &&(
            <div className="chat second">
            {
              selectedContact && (
              <div className="chat-header" onClick={()=>{setThird(true)}}>
              <img src="./Images/image.png" id="chat-header-img" alt="Profile" />
              <p>{selectedContact.username}<br/>{typingUser && <span className="typing-indicator">{typingUser}</span>}</p>
             
              {/* {typingUser && } */}
              
               
  
  
  
              </div>
              )
            }
              
              
  
             
             
    
    
              <div className="chat-body" style={{ backgroundImage: `url(${" ./Images/bg.png"})` }}>
              
              
  
    {selectedContact && joined &&(
    
      <div className="chat-box">
        <div className="messages">
          {chats.map((msg, index) => (
            
            <div
              key={index}
              className={`message ${msg.userName === pro_uname ? "own" : "other"}`}
             
            >
             {
                sessionStorage.setItem("notUser",msg.userName)
             }
             
             
              {/* <span className="username">{msg.userName}</span> */}
              <p id="chat-text"><span className="chat-text">{msg.text}</span><span id="msg-time">{msg.timeStamp}</span></p>
              
             
              
            
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
    )
  }
  
  
  
  
  
  
  
  
            
              
              
              
              
              </div>
  
  
  
  
  
  
  
  
  
  
              <div className="type-msg">
                 <div className="items">
                     
                      <IoMdImages id="img-send"/>
                      
                      
                         <input type="text" placeholder="Type a message..."  onKeyDown={handleKeyDown} id="entered-msg" value={chat} onChange={handleChange} />
                      
                    
                        {
                          showIcon &&(
                             <IoSendSharp onClick={sendMessage}  id="send-arrow"/>
                          )
                        }
                      
                     
                 </div>
              </div>
    
    
    
    
    
    
          </div>
          )
        ):(
          <div className="profile-window third">

          <div className="contact-nav">
          
          <RxCross1 id="contact-cross" onClick={()=>{setThird(false)}}/><span>Contact info</span>
          <BsThreeDotsVertical id="contact-dot"/>
          </div>


    <div className="contact-scroll2">
    {selectedContact && (
               <div className="contact-chat">
                 <img src="./Images/image.png" id="dp-contact-default" alt="Profile" />
                
                 <h2>{selectedContact.username}</h2>
                 <p>
                   +91 {selectedContact.mobile}
                 </p>
     
     
                 <div className="about">
                  <div className="pabout">
                  <p id="aboutp">About</p>
                  <p>{selectedContact.about}</p>
                  <p>{selectedContact._id}</p>
                  </div>
                   </div>
     
     
     
     
     
                   <div className="block">
                   <ImBlocked id="blockIcon"/>
                    <span>Block</span>
                   </div>
     
                   <div className="block">
                   <RiDeleteBin6Fill id="blockIcon"/>
                    <span>Delete chat</span>
                   </div>
                  
                   
                   
                   <div className="block" onClick={()=>{setIsPopup(true)}}>
                    
                   <FcDeleteDatabase id="blockIcon"/>
                    <span>Delete contact</span>
                   </div>
               </div>
             )}
    </div>
           

         
     
          </div>
     
        )
      }
        
        
      
     
      {/* Chat Window */}
     

















     {/* profile window */}
     
      
    
    

     {isPopup && (
        <div className="popup-overlay">
          <div className="logout-popup">
            <div className="popup-text">
              <h3>Delete contact ?</h3>
              <p>Are you sure to delete the contact ?</p>
              <p id="see">Removing from contact list ! Click 'Delete' to confirm.</p>
            </div>
            <div className="popup-button">
              <button type="button" id="logoutCancel" onClick={() => setIsPopup(false)}>
                Cancel
              </button>
              <button id="logoutBtn" onClick={()=>{handleContactDelete(selectedContact._id)}}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}













    </div>
  );
};

export default Chatboard;