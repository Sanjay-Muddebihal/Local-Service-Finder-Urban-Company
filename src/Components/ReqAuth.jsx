import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

const ReqAuth = ({ children }) => {
  const { isAuth } = useSelector((s) => s.AuthReducer);
  const location   = useLocation();
  const toast      = useToast();

  if (!isAuth) {
    toast({
      title: "Login required",
      description: "Please sign in to continue.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ReqAuth;
