import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { auth } from "../../firebase";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import _ from "lodash/fp";
import AlertMessage from "../AlertMessage";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const { register, errors, handleSubmit, watch } = useForm({
    criteriaMode: "all",
  });
  const passwordRef = useRef({});
  passwordRef.current = watch("passwordInput", "");

  var actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.

    // 驗證信轉址
    url: "http://localhost:3000/signup",
    // This must be true.
    handleCodeInApp: true,
    // iOS: {
    //   bundleId: "com.example.ios",
    // },
    // android: {
    //   packageName: "com.example.android",
    //   installApp: true,
    //   minimumVersion: "12",
    // },
    // dynamicLinkDomain: "example.page.link",
  };

  // 當使用者由郵件登入
  useEffect(() => {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      console.log("isSignInWithEmailLink");
      const email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        // email = window.prompt("Please provide your email for confirmation");
        history.push("/login");
      }

      auth
        .signInWithEmailLink(email, window.location.href)
        .then((result) => {
          // Clear email from storage.
          console.log(result.user);
          window.localStorage.removeItem("emailForSignIn");

          // You can check if the user is new or existing:
          console.log(result.additionalUserInfo.isNewUser);
          const newUser = result.additionalUserInfo.isNewUser;
          if (newUser) {
            // 轉址 /profile 輸入身高體重等資訊
            window.localStorage.setItem("newUser", true);
            history.push("/profile");
          } else {
            //   history.push("/profile");
            window.localStorage.removeItem("newUser");
            console.log("此帳號已註冊過");
          }

          // result.additionalUserInfo.isNewUser
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  }, []);

  // 註冊
  const signUp = () => {
    //郵件驗證信;
    // auth
    //   .sendSignInLinkToEmail(email, actionCodeSettings)
    //   .then(() => {
    //     // The link was successfully sent. Inform the user.
    //     // Save the email locally so you don't need to ask the user for it again
    //     // if they open the link on the same device.
    //     window.localStorage.setItem("emailForSignIn", email);

    //     // ...
    //   })
    //   .catch((error) => {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     setAlertMessage(errorMessage);
    //   });

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((auth) => {
        // if successfully create new User
        console.log(auth);
        if (auth) {
          history.push("/login");
        }
        // set user !!!!
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("errorCode: ", errorCode);
        const errorMessage = error.message;
        setAlertMessage(errorMessage);
      });
  };

  return (
    <div className="signUp">
      <form className="login__form" onSubmit={(e) => e.preventDefault()}>
        <div className="login__formBox">
          <label className="login__formLabel">E-mail:</label>
          <input
            className="login__formInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="emailInput"
            ref={register({
              required: "email is required.",
            })}
          />
          {/* email error message */}
          <AlertMessage message={errors?.emailInput?.message} />
          {/* <ErrorMessage
            errors={errors}
            name="emailInput"
            render={({ messages }) => {
              console.log("messages", messages);
              return messages
                ? _.entries(messages).map(([type, message]) => (
                    <p className="alertMessage" key={type}>
                      {message}
                    </p>
                  ))
                : null;
            }}
          /> */}
        </div>

        {/* password input */}
        <div className="login__formBox">
          <label className="login__formLabel">Password:</label>
          <input
            className="login__formInput"
            type="password"
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
            name="passwordInput"
            ref={register({
              required: "password is required.",
              pattern: {
                //1個字母和1個數字
                value: /^[A-Za-z0-9]+$/,
                message: "至少1個字母和1個數字",
              },
              maxLength: {
                value: 15,
                message: "This password should less than 16 characters",
              },
              minLength: {
                value: 8,
                message: "This password must exceed 8 characters",
              },
            })}
          />
          {/* password error message */}
          <AlertMessage message={errors?.passwordInput?.message} />
        </div>

        {/* confirm password input */}
        <div className="login__formBox">
          <label className="login__formLabel">Confirm Password:</label>
          <input
            className="login__formInput"
            type="password"
            // value={confirmPassword}
            // onChange={(e) => setConfirmPassword(e.target.value)}x
            name="confirmPasswordInput"
            ref={register({
              required: "confirm password is required.",
              validate: (value) =>
                // 密碼與二次密碼是否相符
                value === passwordRef.current
                  ? setPassword(passwordRef.current)
                  : "The passwords do not match",
              pattern: {
                value: /^[A-Za-z0-9]+$/,
                message: "至少1個字母和1個數字",
              },
              maxLength: {
                value: 15,
                message: "This password should less than 16 characters",
              },
            })}
          />

          {/* confirm password error message */}
          <AlertMessage message={errors?.confirmPasswordInput?.message} />
          <AlertMessage message={alertMessage} />
          {/* <ErrorMessage
            errors={errors}
            name="confirmPasswordInput"
            render={({ messages }) => {
              console.log("messages", messages);
              return messages
                ? _.entries(messages).map(([type, message]) => (
                    <p className="alertMessage" key={type}>
                      {message}
                    </p>
                  ))
                : null;
            }}
          /> */}
        </div>

        {/* submit button */}
        <Button
          type="submit"
          className="login__passwordEmailButton"
          onClick={handleSubmit(signUp)}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
