import React from "react";
import { useParams } from "react-router-dom";
import { Form as Input } from "react-bootstrap";
import { getAuth, SegureRoute } from "../../utils";
import { useSocket } from "../../components/provider";
import { Form } from "../../components";
import "./styles.css";

interface IMessages {
  uuid: string;
  userId: string;
  message: string;
  createAt: string;
}

export const Messages: React.FC<any> = () => {
  SegureRoute();
  const socket = useSocket();
  const { token, user } = getAuth();
  const { id } = useParams();
  const [messages, setMessages] = React.useState<IMessages[]>([]);

  const getMessages = socket.channel("get/chats/messages", {
    onSuccess: setMessages,
    onError: console.error,
  });

  const postMessages = socket.channel<any>("post/chats/send", {
    onSuccess: (message) => setMessages((list) => [...list, message]),
    onError: console.error,
    room: id,
  });

  React.useEffect(() => {
    if (!socket || !getMessages) return;
    getMessages.on();
    postMessages.on();
    getMessages.emit({ data: {} as any, params: { uuid: id } }, token);
    return () => {
      if (!socket || !getMessages) return;
      getMessages.off();
      postMessages.off();
    };
  }, [id]);
  return (
    <>
      <div
        className="container align-content-end messages"
        style={{ height: "calc(100% - 8rem)" }}
      >
        {Array.isArray(messages) && messages.length
          ? messages.map(({ message, createAt, userId }, key) => (
              <Message
                message={message}
                time={createAt}
                my={user?.uuid == userId}
                key={key}
              />
            ))
          : null}
      </div>
      <Form<any>
        className="d-flex mt-3 px-3"
        onSubmit={(data) => {
          if (!postMessages) return;
          console.log({ data });

          postMessages.emit(
            {
              data,
              params: {
                uuid: id,
                room: id,
              },
            },
            token
          );
        }}
      >
        <Input.Control name="message" placeholder="Type a message" />
        <button className="ms-2">Send</button>
      </Form>
    </>
  );
};

export const Message: React.FC<{
  message: string;
  time: string;
  my?: boolean;
}> = ({ message, my }) => {
  return (
    <div className={`d-flex mb-3 ${my ? "justify-content-end" : ""}`}>
      <span className={`message ${my ? "my" : ""} py-1 px-3 pb-2`}>
        {message}
      </span>
      {/* <small>
        <i>{time}</i>
      </small> */}
    </div>
  );
};
