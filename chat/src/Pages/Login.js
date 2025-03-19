import { useNavigate,Link } from "react-router-dom";
import { useState} from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () =>{
  const navigate=useNavigate();
 const [phone,setPhone]=useState();
 const[password,setPassword]=useState();

 const [otp, setOtp] = useState("");
  
   
 

  
 const sendOTP = async (e) => {
  e.preventDefault();
  
  try {
    const response = await axios.post("http://localhost:3001/api/loginOTP", { phone });

    if (response.status === 201) {
      toast.success("OTP sent successfully!", { position: "top-right" });
    }else{
      toast.error("Network error, please check your connection!", { position: "top-right" });
    }

  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 404) {
        toast.error(data.message ,{ position: "top-right" });
      } else if (status === 500) {
        toast.error(data.message || "Internal Server Error. Please try again!", { position: "top-right" });
      } else {
        toast.error("An unexpected error occurred!", { position: "top-right" });
      }
    } else {
      toast.error("Network error, please check your connection!", { position: "top-right" });
    }
  }
};



const isLogin = async (e) => {
 

  try {
    const response = await axios.post("http://localhost:3001/api/login", {
      phone,
      password,
    });
  
    // Store token in localStorage (or sessionStorage)
  //   localStorage.setItem("token", response.data.token);
    if(response!==400 || response!==401 || response!==500){
      sessionStorage.setItem("phone",phone);
      toast.success("Successfully logged in!", { position: "top-right" });
     navigate("/chatboard");
    }
   
    // Redirect to dashboard after login
  } catch (error) {
    toast.error("Invalid credentials !", { position: "top-right" });
    }  
  
};




const verifyOTP = async () => {
 

  try {
    let inputs = document.getElementsByTagName("input");

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === "") {
            inputs[i].classList.add("border");
        }
    }
    const response = await axios.post("http://localhost:3001/api/verifyloginOTP", {
      phone,
      otp: otp,
    });
   
    if (response.status === 200) {
      toast.success("OTP Verified!", { position: "top-right" });
     isLogin();
    } else if(response.status===400) {
      toast.error("Invalid OTP!", { position: "top-right" });
    }
  } catch (error) {
    toast.error("Entered invalid otp !", { position: "top-right" });
  }
};

 






  return <div>
  <div className="logo">
      <div className="img">
      <img src="./Images/app.png" alt="Not found" />
      </div>
  
  <div className="text">
  <p id="logo-text">Mind Chat</p>
  </div>
 
  </div>

<div className="container clogin">
  <h2>Login Here</h2>
  <ToastContainer />
  <form onSubmit={sendOTP}>
    
      <div className="input-field mobile">
          
          <input type="number" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Mobile No"required />
      </div>
      <div className="input-field password">
         
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"required />
      </div>
      <div className="otp">
            <input type="number" onChange={(e)=>setOtp(e.target.value)} id="otp" placeholder="# Code" /><button type="submit"  id="sc">Send Code</button>
          </div>
    
      <button type="button" onClick={verifyOTP} className="login" >Login</button>
      <div className="al">
          <Link to="/forgot" id="fp">Forgot password ?</Link>
      </div>
      <div className="line"></div>
      <button  className="signup" onClick={()=>{navigate("/signup")}}>Signup</button>
  </form>

</div>



</div>
}
export default Login;