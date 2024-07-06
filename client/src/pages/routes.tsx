import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "../components/provider";
import Chat from "./chat";
import { Signin } from "./signin";
import { Signup } from "./signup";

export const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Signin />,
    },
    {
      path: "signup",
      element: <Signup />,
    },
    {
      path: "chat",
      element: <Chat />,
    },
  ]);
  return (
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  );
};
