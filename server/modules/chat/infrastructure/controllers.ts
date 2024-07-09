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
                const authentication = this.generate({ uuid: user.uuid }, 'jwt-secret', '6h');
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
                    name: user.username,
                    messages: []
                });

                const authentication = this.generate({ uuid: user.uuid }, 'jwt-secret', '6h');
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
        this.channel = this.channel.bind(this);
        this.messages = this.messages.bind(this);
        this.chats = this.chats.bind(this);
        this.send = this.send.bind(this);
    }

    send(method: string) {
        this.socke.channel<any>(this.channel(method, "send"), async (data, response, error) => {
            try {
                if (!data.body.message) throw "El texto del mensaje es requerido!.";
                if (!data?.session) throw "Acceso no autorizado";
                const user = await this.user.findOne({ uuid: data?.session.uuid });
                if (!user) throw "Acceso no autorizado";

                const message = {
                    message: data.body.message,
                    userId: user.uuid
                } as Message;

                const chat = await this.chat.findOne({ uuid: data.params.uuid });
                if (!chat) throw "El recurso no existe";



                chat.messages.push(message);
                await chat.save();

                (message as any).user = {
                    name: user.name
                }

                response(message);
            } catch (err: any) {
                error(err);
            }
        }, true, true);
    }

    messages(method: string) {
        this.socke.channel<any>(this.channel(method, "messages"), async (data, response, error) => {
            try {
                if (!data?.session) throw "Acceso no autorizado";

                const chat = await this.chat.findOne<Chat>({ uuid: data.params.uuid })
                // const [chat] = await this.chat.aggregate<Chat>([
                //     { $match: { uuid: data.params.uuid } },
                //     { $unwind: "$messages" },
                //     {
                //         $lookup: {
                //             from: "users",
                //             localField: "messages.userId",
                //             foreignField: "uuid",
                //             as: "user"
                //         }
                //     },
                //     { $set: { "messages.user": { $arrayElemAt: ["$user", 0] } } },
                //     {
                //         $unset: [
                //             "messages.user.phone",
                //             "messages.user.username",
                //             "messages.user.createdAt",
                //             "messages.user.updatedAt",
                //         ]
                //     },
                //     {
                //         $group: {
                //             _id: "$_id",
                //             messages: { $push: "$messages" }
                //         }
                //     }
                // ])

                console.log({ uuid: chat?.uuid, q_uuid: data.params.uuid });

                // findById(data.params.chat);
                response(chat ? chat.messages : [])
            } catch (err: any) {
                error(err);
            }
        }, true);
    }

    chats(method: string) {
        this.socke.channel<any>(this.channel(method, "all"), async (_, response, error) => {
            try {
                const chats = await this.chat.find();
                response(chats || []);
            } catch (err: any) {
                error(err);
            }
        }, true);
    }

    private channel(method: string, name: string) {
        return `${method}/${this.path}/${name}`
    }

}