import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { auth, provider__Google, provider__FB } from "../../firebase";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";

const Login = () => {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    // 登入
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        // history.push("/"); // 轉址到首頁
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => alert(error.message));
    //firebase
  };

  const forgotPassword = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        console.log("sendPasswordResetEmail");
        // Password reset email sent.
      })
      .catch(function (error) {
        // Error occurred. Inspect error.code.
      });
  };

  const register = (e) => {
    // 註冊
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((auth) => {
        // if successfully create new User
        console.log(auth);
        if (auth) {
          history.push("/"); // 轉址到首頁
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("errorCode: ", errorCode);
        const errorMessage = error.message;
        switch (errorCode) {
          // 註冊密碼太弱
          case "auth/weak-password":
            alert("The password is too weak."); // Thrown if the password is not strong enough.
            break;

          case "auth/operation-not-allowed":
            alert(
              "Email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab."
            );
            break;
          // 電子郵件格式不對
          case "auth/invalid-email":
            alert("The email address is not valid.");
            break;
          // 電子郵件已註冊
          case "auth/email-already-in-use":
            alert(
              "There already exists an account with the given email address."
            );
            break;
          default:
            alert(errorMessage);
        }
        alert(errorMessage);
      });
    //firebase
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
        // history.push("/"); // 轉址到首頁
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
      });
  };

  return (
    <div className="login" style={{ marginTop: "200px" }}>
      <form action="">
        <h5>電子郵件</h5>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <h5>密碼</h5>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="Amazon__button" onClick={signIn}>
          繼續
        </button>
      </form>
      <button className="login__registerButton" onClick={register}>
        建立您的Amazon帳戶
      </button>
      <button onClick={forgotPassword}>forget password?</button>

      <Button type="submit" onClick={signIn__Google}>
        Google 登入
      </Button>
      {/* https://developers.facebook.com/?locale=zh_TW */}
      {/* Facebook 登入 需要 申請 facebook developer 故等到網站上線再回來處理 */}
      <Button type="submit" onClick={signIn__FB}>
        Facebook 登入
      </Button>
    </div>
  );
};

export default Login;
