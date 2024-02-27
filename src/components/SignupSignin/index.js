import React, { useState } from 'react'
import './style.css';
import Input from '../Input';
import Button from '../Button';
import {  createUserWithEmailAndPassword , signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import {auth,db,provider} from '../../firebase'
import { doc, getDoc, setDoc } from "firebase/firestore"; 

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


function SignupSigninComponent() {
  const [name, setName]=useState("");
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [confirmPassword, setConfirmPassword]=useState("");
  const [loading, setLoading]=useState(false);

  const [loginForm, setLoginForm]=useState(false);

  const navigate = useNavigate();

  function signupWithEmail(){
    console.log(name,email,password,confirmPassword);
    setLoading(true);

    

    if(name!=="" && email!=="" && password!=="" && confirmPassword!==""){
      
      if(password==confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          toast.success("User Created!")
          setLoading(false);
          console.log(user);

          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          createDoc(user);

          navigate('/dashboard');
  
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
      }else{
        toast.error("Passwords and ConfirmPassword don't match");
        setLoading(false);
      }
    }else{
      toast.error("Please fill all the fields");
      setLoading(false);
    }
  }

  function loginUsingEmail(){
    console.log(email,password);
    setLoading(true);

    if(email!=="" && password!==""){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      toast.success("User logged In!")
      setLoading(false);
      createDoc(user);
      
      navigate('/dashboard');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(errorMessage);
      setLoading(false);
    });
   }else{
    toast.error("Please fill all the fields");
      setLoading(false);
   }
  }


  async function createDoc(user){
    if(!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if(!userData.exists()){
      try{
        await setDoc(doc(db, "users", user.uid),{
          name: user.displayName ? user.displayName : name,email: user.email,
          photoURL: user.photoURL? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc Created!")
      }
      catch(error){
       toast.error(error.Message)
      }
    }else{
      toast.error("Document already exists.")
    }
  }


  function googleAuth(){
    setLoading(true);
    try{
      signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    console.log("User Data Available =>", user);
    createDoc(user);
    toast.success("User Authenticated"); 
    setLoading(false);
    navigate('/dashboard');

  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage);
    setLoading(false);
  });
    }catch(error){
      toast.error(error.Message)
      setLoading(false);
    }
  }


  return (
    <>
    {loginForm ? 
    <div className='singup-wrapper'>
      <h2 className='title'>
        Login on <span style={{color:'var(--theme)'}}>Financely.</span>
      </h2>
      <form>
        
        <Input lable={"email"} state={email} setState={setEmail} placeholder={"JoneDeo@gmail.com"} type="email"/>

        <Input lable={"password"} state={password} setState={setPassword} placeholder={"Example@123"} type='password'/>

        <Button text={loading?"Loading...":"Login Using Email and Password"} onClick={loginUsingEmail} disabled={loading}/>
        
        <p className='p-login'>or</p>

        <Button text={loading?"Loading...":"Signup Using Google"} blue={true} disabled={loading} onClick={googleAuth}/>
        <p className='p-login' onClick={()=>setLoginForm(!loginForm)}>Or Don't Have An Account? Click Here</p>

      </form>
    </div>:

    <div className='singup-wrapper'>
      <h2 className='title'>
        Sing Up on <span style={{color:'var(--theme)'}}>Financely.</span>
      </h2>
      <form>
        <Input lable={"full name"} state={name} setState={setName} placeholder={"Jone Deo"}/>

        <Input lable={"email"} state={email} setState={setEmail} placeholder={"JoneDeo@gmail.com"} type="email"/>

        <Input lable={"password"} state={password} setState={setPassword} placeholder={"Example@123"} type='password'/>

        <Input lable={"Confirm Password"} state={confirmPassword} setState={setConfirmPassword} placeholder={"Example@123"} type='password'/>

        <Button text={loading?"Loading...":"Signup Using Email and Password"} onClick={signupWithEmail} disabled={loading}/>
        
        <p className='p-login'>or</p>

        <Button text={loading?"Loading...":"Signup Using Google"} blue={true} disabled={loading} onClick={googleAuth}/>
        <p className='p-login' onClick={()=>setLoginForm(!loginForm)}>Or Have An Account Already? Click Here</p>
      </form>
    </div>
    }
    </>
  )
}

export default SignupSigninComponent