import { useContext } from "react";
import {useGlobalContext} from "../contexts/JWTAuthContext";

const useAuth = () => useGlobalContext();
export default useAuth;
