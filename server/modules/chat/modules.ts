import { SocketServer } from "socket-lemur";
import { ChatModel, UserModel } from './models';
import { UserController } from "./infrastructure";
import { ChatRouter, UserRouter } from "./infrastructure/routers";
import { ChatController } from "./infrastructure/controllers";
import { Session } from "../types";

export class UserModule<S extends Session> {
    constructor(
        private readonly path: string,
        private readonly socke: SocketServer<S>,
        private readonly user: typeof UserModel,
        private readonly chat: typeof ChatModel,
    ) {

        // Init controller
        new UserRouter(new UserController<S>(
            this.path, // Ruter
            this.socke, // Socket
            this.user, // model
            this.chat, // model
        ));
    }
}

export class ChatModule<S extends Session> {
    constructor(
        private readonly path: string,
        private readonly socke: SocketServer<S>,
        private readonly chat: typeof ChatModel,
        private readonly user: typeof UserModel,
    ) {
        // Init controller
        new ChatRouter(new ChatController<S>(
            this.path, // Ruter
            this.socke, // Socket
            this.chat, // Model
            this.user // Model
        ));

    }
}