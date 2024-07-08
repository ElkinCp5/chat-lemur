import { SocketServer, TokenManager } from "socket-lemur";
import { ChatModel, UserModel } from "./models";
import { Session } from '../../types';
import { Chat, Message } from "./schemas";

export class UserController<S extends Session> extends TokenManager {
    constructor(
        private readonly path: string,
        private readonly socke: SocketServer<S>,
        private readonly user: typeof UserModel,
        private readonly chat: typeof ChatModel,
    ) {
        super();
        this.channel = this.channel.bind(this);
        this.signin = this.signin.bind(this);
        this.signup = this.signup.bind(this);
    }

    signin(method: string) {
        this.socke.channel<any>(this.channel(method, "signin"), async (data, response, error) => {
            try {
                const user = await this.user.findOne({
                    phone: data.body.phone,
                    username: data.body.username
                });
                if (!user) throw "El telefono o username es invlido";
                const authentication = this.generate({ id: user.id }, 'jwt-secret', '6h');
                response({ user, authentication })

            } catch (err: any) {
                error(err);
            }
        });
    }

    signup(method: string) {
        this.socke.channel<any>(this.channel(method, "signup"), async (data, response, error) => {
            try {
                if (
                    !data.body?.username ||
                    !data.body?.phone ||
                    !data.body.name
                ) throw "Formulario invalido";

                const exist = await this.user.findOne({
                    $or: [
                        { username: data.body?.username },
                        { phone: data.body?.phone }
                    ]
                });
                if (exist) throw "Esta cuenta ya esta registrada";

                const user = await this.user.create({
                    name: data.body.name,
                    phone: data.body.phone,
                    username: data.body.username
                });

                await this.chat.create({
                    name: user.name,
                    messages: []
                });

                const authentication = this.generate({ id: user.id }, 'jwt-secret', '6h');
                response({ user, authentication })
            } catch (err) {
                error(err);
            }
        });
    }

    private channel(method: string, name: string) {
        return `${method}/${this.path}/${name}`
    }
}

export class ChatController<S extends Session> {
    constructor(
        private readonly path: string,
        private readonly socke: SocketServer<S>,
        private readonly chat: typeof ChatModel,
        private readonly user: typeof UserModel,
    ) {
        this.send = this.send.bind(this);
        this.messages = this.messages.bind(this);
    }

    send(method: string) {
        this.socke.channel<any>(`${method}/${this.path}/send`, async (data, response) => {
            if (!data?.session) throw "Acceso no autorizado";
            const user = await this.user.findById(data?.session.id);
            if (!user) throw "Acceso no autorizado";

            const message = {
                message: data.body.message,
                userId: user.id
            } as Message;

            await this.chat.findByIdAndUpdate(
                data.params.chat,
                { $push: { messages: message } },
                { new: true }
            );

            (message as any).user = {
                name: user.name
            }

            response(message);
        }
        );
    }

    async messages(method: string) {
        this.socke.channel<any>(`${this.path}/${method}/messages`, async (data, response) => {
            if (!data?.session) throw "Acceso no autorizado";
            const [chat] = await this.chat.aggregate<Chat>([
                { $match: { id: data.params.chat } },
                { $unwind: "$messages" },
                {
                    $lookup: {
                        from: "users",
                        localField: "messages.userId",
                        foreignField: "id",
                        as: "user"
                    }
                },
                { $set: { "messages.user": { $arrayElemAt: ["$user", 0] } } },
                {
                    $unset: [
                        "messages.user.phone",
                        "messages.user.username",
                        "messages.user.createdAt",
                        "messages.user.updatedAt",
                    ]
                },
                {
                    $group: {
                        _id: "$_id",
                        messages: { $push: "$messages" }
                    }
                }
            ])

            // findById(data.params.chat);
            response(chat ? chat.messages : [])
        }
        );
    }

}