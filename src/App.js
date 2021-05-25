import React, { useState, useEffect } from "react";
import "./scss/all.css";
import { Header, Sidebar, SearchPage, VideoDetail } from "./components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import youtube from "./api/youtube";
import { useHistory } from "react-router-dom";
import MealPlan from "./components/MealPlan";
import Profile from "./components/Profile";
import GuessFoodNutrition from "./components/GuessFoodNutrition";
import PickUpRobot from "./components/PickUpRobot";
import Login from "./components/Auth/Login";
import CalendarPage from "./components/CalendarPage";
import SignUp from "./components/Auth/SignUp";
import NoticePage from "./pages/NoticePage";
import { db, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "./pages/LoadingPage";
import SettingPage from "./pages/SettingPage";
import HomePage from "./pages/HomePage";
import PlanDetailPage from "./pages/PlanDetailPage";

function App() {
  const [{ userInfo }, dispatch] = useStateValue();
  const [user, loading, error] = useAuthState(auth);

  // console.log('user: ', user);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const history = useHistory();

  // useEffect(() => {
  //   handleSubmit("健身");
  // }, []);

  const onVideoSelect = (video) => {
    setSelectedVideo(video);
    console.log("video is ", video);
  };

  const handleSubmit = async (inputSearch) => {
    // const response = await youtube.get("search", {
    //   params: {
    //     part: "snippet",
    //     maxResults: 10,
    //     key: "AIzaSyB0xTIo8dLxjuYf09JzzvaXdkDG-9y_K9w",
    //     q: inputSearch,
    //   },
    // });
    // console.log("response", response.data.items);
    // setVideos(response.data.items);
    // setSelectedVideo(response.data.items[0]);
  };

  return (
    <div className="app dark-app">
      {loading ? (
        //need a loading page
        <Loading />
      ) : (
        <Router>
          {user && <Header onFormSubmit={handleSubmit} />}

          <Switch>
            {/* search detail page */}
            <Route path="/searchDetail">
              <div className="app__page detailPage">
                <Sidebar />
                <VideoDetail video={selectedVideo} /> {/* flex: .7; */}
                <SearchPage videos={videos} onVideoSelect={onVideoSelect} />
                {/* flex: .3; */}
              </div>
            </Route>

            {/* search page */}
            <Route path="/search">
              <div className="app__page searchPage">
                <Sidebar />
                {/* flex: .2; */}
                <SearchPage videos={videos} onVideoSelect={onVideoSelect} />
                {/* flex: .8; */}
              </div>
            </Route>

            {/* Meal Plan page */}
            <Route path="/mealPlan">
              <div className="app__page detailPage">
                <Sidebar />
                <MealPlan />
              </div>
            </Route>

            {/* Profile Page*/}
            <Route path="/profile">
              <div className="app__page detailPage">
                <Sidebar />
                <Profile />
              </div>
            </Route>

            <Route path="/planDetail">
              <div className="app__page detailPage">
                <Sidebar />
                <PlanDetailPage />
              </div>
            </Route>

            <Route path="/setting">
              <div className="app__page detailPage">
                <Sidebar />
                <SettingPage />
              </div>
            </Route>

            {/* GuessMealNutrition Page*/}
            <Route path="/guessMealNutrition">
              <div className="app__page detailPage">
                <Sidebar />
                <GuessFoodNutrition />
              </div>
            </Route>

            {/* pickUp robot Page*/}
            <Route path="/pickUpRobot">
              <div className="app__page detailPage">
                <Sidebar />
                <PickUpRobot />
              </div>
            </Route>

            {/* SignUp Page */}
            <Route path="/signup">
              <div className="app__page detailPage">
                <Sidebar />
                <SignUp />
              </div>
            </Route>

            {/* Login Page */}
            {!user && (
              <Route path="/">
                <div className="app__page detailPage">
                  {/* <Sidebar /> */}
                  <Login />
                </div>
              </Route>
            )}

            <Route path="/noticePage">
              <div className="app__page detailPage">
                <Sidebar />
                <NoticePage />
              </div>
            </Route>

            {/* Calendar page */}
            <Route path="/calendar">
              <div className="app__page homePage">
                <Sidebar />
                <CalendarPage />
              </div>
            </Route>

            {/* home page */}
            <Route path="/">
              <div className="app__page homePage">
                <Sidebar />
                <HomePage />
                {/* <SearchPage videos={videos} onVideoSelect={onVideoSelect} /> */}
              </div>
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
}

export default App;
