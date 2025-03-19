import express from "express";
import {Register,sendOTP,VerifyOtp,isLogin,sendLoginOTP,VerifyLoginOtp, addContact, fetch, fetchId, delContact, fetchYou, addNewContact} from "./userController.js";

const router = express.Router();
router.post("/register",Register);
router.post("/sendOTP",sendOTP);
router.post("/verifyOTP",VerifyOtp);
router.post("/login",isLogin);
router.post("/loginOTP",sendLoginOTP);
router.post("/verifyloginOTP",VerifyLoginOtp);
router.post("/addContact",addContact)
router.post("/addNewContact",addNewContact);
router.post("/fetch",fetch);
router.post("/fetchYou",fetchYou);
router.post("/contact/:id",fetchId);
router.delete("/delete/:id",delContact);
// router.post("/user/:id",fetchUserId);
export default router;