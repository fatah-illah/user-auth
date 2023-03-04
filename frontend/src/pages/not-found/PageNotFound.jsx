import React from "react";
import "./PageNotFound.css";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <section className="not-found-container">
      <h1 className="not-found-heading">Sorry, couldn't find this page!</h1>
      <br />
      <p className="not-found-text">
        If logged in go to{" "}
        <Link className="link" to="/welcome">
          Welcome
        </Link>
      </p>
      <p className="not-found-text">
        Else{" "}
        <Link className="link" to="/sign-in">
          Log In
        </Link>
      </p>
    </section>
  );
};

export default PageNotFound;
