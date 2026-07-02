import React from "react";
import { Navigate } from "react-router-dom";
//import { useAuthToken } from "../services/auth/set-cookie";


type PrivateRouteProps = {
  children: React.ReactElement;
};

export function AuthenticatedRoute({ children }: PrivateRouteProps) {
  //const { getToken } = useAuthToken(); 
  const  getToken  = true; 

  return  getToken ? children :<Navigate to="/"/>;
}