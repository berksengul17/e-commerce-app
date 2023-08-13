import React, { useContext } from "react";
import styles from "./header.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHouse } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";

function Header() {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isSignUpPage = location.pathname === "/signup";
  const isLoginPage = location.pathname === "/login";

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className={styles.header}>
      <Link to="/">
        <FontAwesomeIcon className={styles.icon} icon={faHouse} size="2x" />
      </Link>
      {/* If a user is logged in display the welcome message
          else show the login and sign up button unless it is
          the login or sign up page */}
      {user ? (
        <div className={styles.userContainer}>
          <Link to="/cart">
            <FontAwesomeIcon
              className={styles.icon}
              icon={faShoppingCart}
              size="xl"
            />
          </Link>
          <Button text="Logout" onClick={handleLogout} theme="dark" />
        </div>
      ) : (
        !isSignUpPage &&
        !isLoginPage && (
          <div className={styles.buttonContainer}>
            <Button
              text="Login"
              onClick={() => navigate("/login")}
              theme="dark"
            />
            <Button
              text="Sign up"
              onClick={() => navigate("/signup")}
              theme="dark"
            />
          </div>
        )
      )}
    </div>
  );
}

export default Header;
