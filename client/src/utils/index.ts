import { SocketClient } from "socket-lemur";

const PORT = 4040;
const url = `http://localhost:${PORT}`;

export const socketClient = () => new SocketClient(url, {
    apiKey: "api-key",
    autoConnect: false,
});