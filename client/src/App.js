import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import { useContext } from "react";
import { UserContext } from "./context/UserProvider";
import "./App.css";

function App() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to=".." replace={true} />}
        />
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to=".." replace={true} />}
        />
        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/" replace={true} />}
        />
        <Route
          path="/checkout"
          element={
            location.state && location.state.from === "cart" ? (
              <Checkout />
            ) : (
              <Navigate to=".." replace={true} />
            )
          }
        />
        <Route
          path="/success"
          element={
            location.state && location.state.from === "checkout" ? (
              <Success />
            ) : (
              <Navigate to=".." replace={true} />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
