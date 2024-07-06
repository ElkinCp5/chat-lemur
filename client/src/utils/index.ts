import { SocketClient } from "socket-lemur/dist/browser";

const PORT = 3030;
const url = `http://localhost:${PORT}`;

export const socketClient = () => new SocketClient(url, {
    apiKey: "api-key",
    autoConnect: false,
});