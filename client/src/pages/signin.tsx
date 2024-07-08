import React from "react";
import Cookies from "js-cookie";
import { Form } from "../components";
import { useSocket } from "../components/provider";

interface ISignin {
  username: string;
  phone: string;
}

export const Signin = () => {
  const socket = useSocket();
  const [form, setForm] = React.useState<ISignin>({
    username: "",
    phone: "",
  });

  const signin = socket.channel("post/users/signin", {
    onSuccess: ({ user, authentication }: any) => {
      Cookies.set("token", authentication, { expires: 1, sameSite: "strict" });
      Cookies.set("name", user.name, { expires: 1, sameSite: "strict" });
      location.reload();
    },
    onError: console.error,
  });

  const onChange = ({ target }: any) => {
    setForm((st) => ({ ...st, [target.name]: target.value }));
  };

  React.useEffect(() => {
    if (!socket || !signin) return;
    signin.on();
    return () => {
      if (!socket || !signin) return;
      signin.off();
    };
  }, [socket]);

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-md-6">
          <Form<ISignin>
            onSubmit={(data) => {
              console.log({ data, socket });
              if (!signin) return;

              signin.emit({ data });
            }}
          >
            <div className="form-group">
              <label>Username</label>
              <input
                name="username"
                className="form-control"
                onChange={onChange}
                value={form.username}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                name={"phone"}
                className="form-control"
                onChange={onChange}
                value={form.phone}
              />
            </div>
            <button
              type="submit"
              disabled={
                !Object.values(form).every((val) => val) && socket != undefined
              }
            >
              Login
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};
