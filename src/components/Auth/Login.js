import React from "react";
import { Button } from "@material-ui/core";
import { auth, provider } from "../../firebase";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";

const Login = () => {
  const [{ user }, dispatch] = useStateValue();
  const signIn = (e) => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        console.log(result);
      })
      .catch((error) => alert(error.message));
  };
  return (
    <div className="login" style={{ marginTop: "200px" }}>
      <Button type="submit" onClick={signIn}>
        Google登入
      </Button>
    </div>
  );
};

export default Login;
