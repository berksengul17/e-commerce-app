import React, { useContext } from "react";
import styles from "./header.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";

function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isSignUpPage = location.pathname === "/signup";
  const isLoginPage = location.pathname === "/login";

  return (
    <div className={styles.header}>
      <Link to="/">
        <h1>e-Commerce</h1>
      </Link>
      {/* If a user is logged in display the welcome message
          else show the login and sign up button unless it is
          the login or sign up page */}
      {user ? (
        <div className={styles.userContainer}>
          <Link to="/cart">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </Link>
          <FontAwesomeIcon icon={faUser} size="lg" />
          <Button text="Logout" onClick={() => setUser(null)} />
        </div>
      ) : (
        !isSignUpPage &&
        !isLoginPage && (
          <div className={styles.buttonContainer}>
            <Button text="Login" onClick={() => navigate("/login")} />
            <Button text="Sign up" onClick={() => navigate("/signup")} />
          </div>
        )
      )}
    </div>
  );
}

export default Header;
