import { SocketServer } from "socket-lemur";
import { ChatModule, UserModule } from "./chat/modules";
import { ChatModel, UserModel } from "./chat/models";
import { Session } from "./types";


export class Modules<S extends Session> {
    constructor(
        private readonly socke: SocketServer<S>,
    ) {
        new UserModule<S>("users", this.socke, UserModel, ChatModel);
        new ChatModule<S>("chats", this.socke, ChatModel, UserModel);
    }
}