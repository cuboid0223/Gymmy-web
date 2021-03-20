import React from "react";
import { Button } from "@material-ui/core";
import { auth, provider__Google, provider__FB } from "../../firebase";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";

const Login = () => {
  const [{ user }, dispatch] = useStateValue();
  const signIn__Google = (e) => {
    auth
      .signInWithPopup(provider__Google)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        // console.log(result);
      })
      .catch((error) => alert(error.message));
  };
  const signIn__FB = (e) => {
    auth
      .signInWithPopup(provider__FB)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        console.log(result);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(errorCode, errorMessage, email, credential);
      });
  };

  return (
    <div className="login" style={{ marginTop: "200px" }}>
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
