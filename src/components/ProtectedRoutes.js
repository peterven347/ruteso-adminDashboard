import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useStore";

export default function ProtectedRoutes({ children }) {
  const { auth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth) {
        navigate("/", { replace: true })
    } else {
        navigate("/login", { replace: true })
    }
  }, [auth]);

  return children;
}
