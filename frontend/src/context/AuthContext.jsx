import { useState } from "react";
import { useEffect } from "react";
import { Children } from "react";
import { createContext } from "react";
import axios from "axios";
import link from "../environment";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [userAvailable, setUserAvailable] = useState(false);
    const [user, setUser] = useState({
        name: "Guest",
        avatar: "G",
        status: "Online",
    })

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const res = await axios.get(`${link}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res) {
                    setUserAvailable(true);
                    setUser({
                        name: res.data.user.name,
                        avatar: res.data.user.name.charAt(0).toUpperCase(),
                        status: "Online"
                    })
                }
            }
        }
        fetchUser();
    }, [])

    return(
        <AuthContext.Provider value={{user,userAvailable,setUserAvailable,setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext,AuthProvider};