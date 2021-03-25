import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { auth, provider__Google, provider__FB } from "../../firebase";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import FacebookIcon from "@material-ui/icons/Facebook";
import GoogleIcon from "../../assets/icons8-google-48.png";
const Login = () => {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // 登入
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        history.push("/"); // 轉址到首頁
        setSuccessMessage("login success!");
      })
      .catch((error) => {
        setAlertMessage(`login fail! the reason -> ${error.message}`);
        console.log(error.message);
      });
  };

  // 忘記密碼
  const forgotPassword = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        console.log("sendPasswordResetEmail");
        setSuccessMessage("Please check your email!");
        // Password reset email sent.
      })
      .catch(function (error) {
        // Error occurred. Inspect error.code.
      });
  };

  const signIn__Google = (e) => {
    auth
      .signInWithPopup(provider__Google)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        // console.log(result);
        setSuccessMessage("Login with Google!");
        history.push("/"); // 轉址到首頁
      })
      .catch((error) => alert(error.message));
  };

  const signIn__FB = (e) => {
    auth
      .signInWithPopup(provider__FB)
      .then((result) => {
        var token = result.credential.accessToken;
        // The signed-in user info.
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        console.log(result);
        setSuccessMessage("Login with Facebook!");
        history.push("/"); // 轉址到首頁
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        const array = [errorCode, errorMessage, email, credential];
        array.map((item) => console.log(item));
        setAlertMessage(
          `Login with Facebook fail!  the reason ->  ${errorMessage}`
        );
      });
  };

  //  將 global state 的 user ，若是第一次登入則新增到 users
  const addUserToFirebase = () => {};

  return (
    <div className="login">
      {/* <p
        className={
          alertMessage ? "login__alertMessage" : "login__successMessage"
        }
      >
        {alertMessage ? alertMessage : successMessage}
      </p> */}
      <form className="login__form" action="">
        <div className='login__formBox'>
          <label className="login__formLabel">E-mail:</label>
          <input
            className="login__formInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='login__formBox'>
          <label className="login__formLabel">Password:</label>
          <input
            className="login__formInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {alertMessage && <p className="alertMessage">{alertMessage}</p>}

        <Button
          type="submit"
          className="login__passwordEmailButton"
          onClick={signIn}
        >
          Submit
        </Button>

        <Link className="login__registerButton" to="/signup">
          <Button>Sign Up</Button>
        </Link>

        <Button
          className="login__forgetPasswordButton"
          onClick={forgotPassword}
        >
          forget password?
        </Button>
      </form>

      {/* google 登入 */}
      <Button
        className="login__providerButton google-color"
        type="submit"
        onClick={signIn__Google}
      >
        <img className="googleIcon" src={GoogleIcon} alt="googleIcon" />
        Sign up with Google
      </Button>

      {/* facebook 登入 */}
      {/* https://developers.facebook.com/?locale=zh_TW */}
      {/* Facebook 登入 需要 申請 facebook developer 故等到網站上線再回來處理 */}
      <Button
        className="login__providerButton facebook-color"
        type="submit"
        onClick={signIn__FB}
      >
        <FacebookIcon />
        Sign up with Facebook
      </Button>
    </div>
  );
};

export default Login;
