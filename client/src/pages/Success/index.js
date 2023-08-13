import React from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  return (
    <div>
      <p>Your order has been created successfully!</p>
      <div>
        <Button text="Continue shopping" onClick={() => navigate("/")} />
      </div>
    </div>
  );
}

export default Success;
