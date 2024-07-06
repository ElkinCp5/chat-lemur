import { Session } from "../../types";
import { ChatController, UserController } from "./controllers";

export class UserRouter<S extends Session> {
    constructor(
        private readonly ctrl: UserController<S>
    ) {
        this.ctrl.signin("post");
        this.ctrl.signup("post");
    }
}

export class ChatRouter<S extends Session> {
    constructor(
        private readonly ctrl: ChatController<S>
    ) {
        this.ctrl.send("post");
        this.ctrl.messages("get");
    }
}