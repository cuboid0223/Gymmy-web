import React, { useState, useEffect } from "react";
import "./scss/all.css";
import { Header, Sidebar, SearchPage, VideoDetail } from "./components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const history = useHistory();

  useEffect(() => {
    handleSubmit("健身");
  }, []);

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
    <div className="app">
      <Router>
        <Header onFormSubmit={handleSubmit} />
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
          <Route path="/login">
            <div className="app__page detailPage">
              <Sidebar />
              <Login />
            </div>
          </Route>

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
              <SearchPage videos={videos} onVideoSelect={onVideoSelect} />
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
