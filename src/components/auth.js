import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";

export const Auth = (props) => {
  const [errorMessage, setErrorMessage] = useState('');
  let userName = props?.auth?.currentUser?.displayName;
  // userName = userName ? true : false;
  console.log("userName", userName);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage('Email address already in use!');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Email address is invalid.!');
          break;
        case 'auth/operation-not-allowed':
          setErrorMessage('Error during sign up.!');
          break;
        case 'auth/weak-password':
          setErrorMessage('Password is not strong enough. Add additional characters including special characters and numbers.!');
          break;
        default:
          console.log(error.message);
          break;
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {errorMessage && (
        <p className="error"> {errorMessage} </p>
      )}
      {!userName ? (
        <div>
          <input
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password..."
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={signIn}> Sign In</button>

          <button onClick={signInWithGoogle}> Sign In With Google</button>
        </div>
      ) : (
        <div>
          {userName}
          <button onClick={logout}> Logout </button>
        </div>
      )}
    </>
  );
};
