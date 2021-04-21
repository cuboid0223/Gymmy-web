import React, { Component } from "react";
import Stories from "react-insta-stories";

const HomePage = () => {
  const stories = [
    {
      url:
        "https://images.pexels.com/photos/2257779/pexels-photo-2257779.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      type: "image",
    },
    {
      url:
        "https://images.pexels.com/photos/3258702/pexels-photo-3258702.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      type: "image",
    },
  ];
  return (
    <div className="homepage" >
      {/* <Stories
        stories={stories}
        defaultInterval={1500}
        width={"100%"}
        height={"100vh"}
        keyboardNavigation={true}
      /> */}
    </div>
  );
};

export default HomePage;
