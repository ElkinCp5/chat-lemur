import { SocketClient } from "socket-lemur";
import Cookies from 'js-cookie';
import { useLocation } from "react-router-dom";
import React from "react";

const PORT = 4040;
const _AUTH = "auth-lemur";
const _USER = "user-lemur";
const url = `http://localhost:${PORT}`;

export const socketClient = () => new SocketClient(url, {
    apiKey: "api-key",
    autoConnect: false,
});

export const openSession = ({ user, authentication }: any) => {
    Cookies.set(_AUTH, authentication, { expires: 1, sameSite: "strict" });
    Cookies.set(_USER, JSON.stringify({ name: user.name, uuid: user.uuid }), { expires: 1, sameSite: "strict" });
    location.reload();
}

export const closeSession = () => {
    Cookies.remove(_AUTH);
    Cookies.remove(_USER);
    location.reload();
}

export const SegureRoute = () => {
    const uselocation = useLocation();
    const session = get(Cookies.get(_AUTH)) && get(Cookies.get(_USER));

    React.useEffect(() => {
        console.log({ patname: uselocation.pathname, session });
        if (!session && uselocation.pathname.includes("chat")) {
            location.href = "/";
        } else if ((uselocation.pathname.includes("signup") || uselocation.pathname == "/") && session) {
            location.href = "/chat"
        }
    }, []);
}

const get = (atr: any) => {
    if (typeof atr == "undefined") return false;
    if (!atr) return false;
    return true;
}

export const getAuth = () => {
    let user: { uuid: string, name: string } | null = null
    try {
        user = JSON.parse(Cookies.get(_USER) || "{}");
    } catch (error) { }
    return {
        token: Cookies.get(_AUTH) || "",
        user
    };
}