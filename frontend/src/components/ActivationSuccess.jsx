import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ActivationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Tự động chuyển hướng sau 5 giây
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer); // Cleanup nếu component bị unmount
  }, [navigate]);

  return (
    <div className="text-center">
      <a href="/">
        <img
          src="../images/logo.jpg"
          alt="Confirmation"
          style={{ width: "150px", marginBottom: "20px" }}
        />
      </a>
      <h2>Activation Successful</h2>
      <p>Your account has been activated. You will be redirected to the login page in 5 seconds.</p>
    </div>
  );
};

export default ActivationSuccess;
