import React from "react";
import { SocketClient } from "socket-lemur";
import { socketClient } from "../utils";

export interface Chat {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  userId: string;
  user: {
    name: string;
  };
  message: string;
}

interface Data<M, C> {
  messages: Array<M>;
  chats: Array<C>;
}

interface ContextContainer<M, C> {
  data: Data<M, C>;
  loading: boolean;
  client: SocketClient | undefined;
  getChats: () => void;
  getMessages: () => void;
  sendMessage: (message: string) => void;
}

const Context = React.createContext<ContextContainer<Message, Chat>>({
  data: {
    messages: [],
    chats: [],
  },
  loading: false,
  client: undefined,
  getChats: function (): void {
    throw new Error("Function not implemented.");
  },
  getMessages: function (): void {
    throw new Error("Function not implemented.");
  },
  sendMessage: function (_message: string): void {
    throw new Error("Function not implemented.");
  },
});

interface Props {
  children: React.ReactNode;
}

export const Provider: React.FC<Props> = React.memo(({ children }) => {
  const [client, setClient] = React.useState<SocketClient>();
  const [loading, _setLoading] = React.useState<boolean>(false);
  const [state, _setState] = React.useState<{ data: Data<Message, Chat> }>({
    data: {
      messages: [],
      chats: [],
    },
  });

  const getChats = () => {};
  const getMessages = () => {};
  const sendMessage = (_message: string) => {};

  React.useEffect(() => {
    if (client) return;
    socketClient();
    // setClient(socketClient);
  }, []);

  React.useEffect(() => {
    // if (!client) return;
    // if (client.connected()) return;
    // client.connect();
    // console.log({ status: client.connected() });
  }, [client]);

  return (
    <Context.Provider
      value={{
        data: {
          ...state.data,
        },
        loading,
        client,
        getChats,
        getMessages,
        sendMessage,
      }}
    >
      {children}
    </Context.Provider>
  );
});

const getContext = () => React.useContext(Context);
export const useStorage = () => getContext().data;
export const useChats = () => getContext().getChats;
export const useMessages = () => getContext().getMessages;
export const useSendMessage = () => getContext().sendMessage;
