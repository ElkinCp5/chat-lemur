import React from "react";
import { Link } from "react-router-dom";
import { Form } from "../components";
import { useSocket } from "../components/provider";
import { openSession, SegureRoute } from "../utils";

interface ISignin {
  username: string;
  phone: string;
}

export const Signin = () => {
  SegureRoute();
  const socket = useSocket();
  const [form, setForm] = React.useState<ISignin>({
    username: "",
    phone: "",
  });

  const signin = socket.channel("post/users/signin", {
    onSuccess: openSession,
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
            <div className="form-group mb-2">
              <label>Username</label>
              <input
                name="username"
                className="form-control"
                onChange={onChange}
                value={form.username}
              />
            </div>
            <div className="form-group mb-2">
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
              className="mt-3"
            >
              Login
            </button>
            <Link type="submit" to={"/signup"} className="mt-3 mx-3">
              Signup
            </Link>
          </Form>
        </div>
      </div>
    </div>
  );
};
