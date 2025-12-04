import { useCookies } from "react-cookie";

export const useAuthToken = () => {
  const [cookies ] = useCookies(["token"]);

  return { getToken: cookies.token };
};