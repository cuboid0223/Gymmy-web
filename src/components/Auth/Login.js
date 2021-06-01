import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { auth, provider__Google, provider__FB } from "../../firebase";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import FacebookIcon from "@material-ui/icons/Facebook";
import GoogleIcon from "../../assets/icons8-google-48.png";
import AlertMessage from "../AlertMessage";
import logo from "../.././assets/gymmy.png";
import db from "../../firebase";
const Login = () => {
  const [{ user, userInfo, notices }, dispatch] = useStateValue();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  // const storage = window.localStorage;
  // const [user_uid, setUser_uid] = useState(""); // 以保持登入

  // console.log("alertMessage: ", alertMessage);
  const sendNotice = (noticeMessage) => {
    // 發送通知
    dispatch({
      type: actionTypes.SET_NOTICES,
      notices: [
        ...notices,
        {
          imageUrl: { logo },
          message: noticeMessage,
        },
      ],
    });
  };
  // 登入
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        // 先取得 uid from  firebase auth
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });

        // 發送通知

        sendNotice("Login success! Start set up your own information.");

        // console.log("notices: ", notices);
        //
        // console.log("user.emailVerified: ", user?.user.emailVerified);

        if (user?.user.emailVerified === false) {
          // 若信箱沒有認證，則發送通知
          sendNotice(
            "Please verified your email to unlock more Gymmy services."
          );
        }
      })
      .catch((error) => {
        setAlertMessage(`login fail! the reason -> ${error.message}`);
        // console.log(error.message);
      });
  };

  // 從 firestore 取得使用者資料
  useEffect(() => {
    if (!user) {
      return;
    }
    var docRef = db.collection("users").doc(user?.uid);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          dispatch({
            type: actionTypes.SET_USERINFO,
            userInfo: doc.data(),
          });
          console.log("user info:", userInfo);
        } else {
          // firestore 沒有使用者資料
          console.log("No such document!");
          history.push("./profile");
          sendNotice("go to profile and set your height and weight!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [user]);

  // 忘記密碼
  const forgotPassword = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        console.log("sendPasswordResetEmail");
        // 發送通知 Password reset email sent.
        sendNotice(`Please check your email! -> ${email}`);
      })
      .catch(function (error) {
        // Error occurred. Inspect error.code.
      });
  };

  const signIn__Google = (e) => {
    auth
      .signInWithPopup(provider__Google)
      .then((result) => {
        // 登入
        // 先取得 uid from  firebase auth
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        // setUser_uid(user?.uid);
        // 發送通知
        sendNotice("Login with Google!");

        history.push("/profile");
      })
      .catch((error) => alert(error.message));
  };

  const signIn__FB = (e) => {
    auth
      .signInWithPopup(provider__FB)
      .then((result) => {
        var token = result.credential.accessToken;
        // The signed-in user info.
        // 先取得 uid from  firebase auth
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        // 發送通知
        sendNotice("Login with Facebook!");

        history.push("/profile");
      })
      .catch((error) => {
        // Handle Errors here.
        alert(error.message);
      });
  };

  //  將 global state 的 user ，若是第一次登入則新增到 users
  const addUserToFirebase = () => {};

  return (
    <div className="login">
      <img className="login__logo" src={logo} alt="Logo" />
      <div className="login__item">
      <form className="login__form">
        <div className="login__formBox">
          <label className="login__formLabel">E-mail:</label>
          <input
            className="login__formInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login__formBox">
          <label className="login__formLabel">Password:</label>
          <input
            className="login__formInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <AlertMessage message={alertMessage} />

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

      
      <div className="login__Google-and-FB-box">
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
      </div>
    </div>
  );
};

export default Login;
