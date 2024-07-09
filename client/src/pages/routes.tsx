import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "../components/provider";
import { Signin } from "./signin";
import { Signup } from "./signup";
import { Chat } from "./chat";
import { Messages } from "./messages";

const Welcome = () => {
  return (
    <div>
      <h1>Inicio</h1>
    </div>
  );
};

export const Routers = () => {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Signin />} />
          <Route path={"/signup"} element={<Signup />} />
          <Route path={"/chat"} element={<Chat />}>
            <Route index={true} element={<Welcome />} />
            <Route path={":id"} element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};
