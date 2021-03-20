import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";


const PleaseLoginPage = () => {
  return (
    <div className="pleaseLoginPage" style={{ marginTop: "200px" }}>
      <Link to="/login">
        <Button> please login</Button>
      </Link>
    </div>
  );
};

export default PleaseLoginPage;
