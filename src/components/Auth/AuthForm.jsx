import React, { useState, useRef } from "react";
import classes from "./AuthForm.module.css";
import { useHistory } from "react-router-dom";


const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [showError, setShowError] = useState("");
  const [signupInProgress, setSignupInProgress] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // Clear input fields
    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
    if (!isLogin) {
      confirmPasswordInputRef.current.value = "";
    }

    // Optional: Add validation
    if (!isLogin) {
      const enteredConfirmPassword = confirmPasswordInputRef.current.value;
      if (enteredPassword !== enteredConfirmPassword) {
        setPasswordMatch(false);
        return;
      } else {
        setPasswordMatch(true);
      }
    }

    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDCuViJTb6AOhYKBxi4NjeNIIuLCirXHQQ";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDCuViJTb6AOhYKBxi4NjeNIIuLCirXHQQ";
      setSignupInProgress(true);
      setSignupSuccess("");
      setShowError("");
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Authentication failed!");
      }

      if (!isLogin) {
        setSignupSuccess("Signup Successful, you may login");
        // localStorage.setItem("token", data.idToken);
      // Redirect to welcome page
        history.replace("/welcome");
      }
      setShowError("");
      // Check if history object is defined before calling replace
      if (history && typeof history.replace === "function") {
        history.replace("/"); // Redirect to home after login/signup
      }
    } catch (error) {
      console.error("Error during authentication:", error.message);
      setShowError(error.message);
    } finally {
      setSignupInProgress(false);
    }
  };

  const forgotPasswordHandler = () => {
    const enteredEmail = emailInputRef.current.value;
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!enteredEmail || !emailRegex.test(enteredEmail)) {
      setShowError("Please enter a valid email address");
      return;
    }
    if (enteredEmail || emailRegex.test(enteredEmail)) {
      setShowError("");
      return;
    }
    const passUrl =
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDCuViJTb6AOhYKBxi4NjeNIIuLCirXHQQ";
    fetch(passUrl, {
      method: "POST",
      body: JSON.stringify({
        requestType: "PASSWORD_RESET",
        email: enteredEmail,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error sending password reset email:", error);
      });
  };

  return (
    <div className={classes.container}>
      <section className={classes.auth}>
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" required ref={emailInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Your Password</label>
            <input
              type="password"
              id="password"
              required
              ref={passwordInputRef}
            />
          </div>
          {!isLogin && (
            <div className={classes.control}>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                required
                ref={confirmPasswordInputRef}
              />
            </div>
          )}
          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords do not match</p>
          )}
          {showError && <p style={{ color: "red" }}>{showError}</p>}
          {signupInProgress && <p>Sending Request...</p>}
          {signupSuccess && (
            <p style={{ color: "green" }}>{signupSuccess}</p>
          )}
          <div className={classes.actions}>
            <button>{isLogin ? "Login" : "Create Account"}</button>
            <button
              type="button"
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? "Create new account" : "Login with existing account"}
            </button>
            {isLogin && (
              <button
                type="button"
                className={classes.toggle}
                onClick={forgotPasswordHandler}
              >
                Forgot Password
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
};

export default AuthForm;
