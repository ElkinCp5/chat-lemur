import React from "react";
import { Form } from "../components";
import { useSocket } from "../components/provider";
import { openSession, SegureRoute } from "../utils";
import { Link } from "react-router-dom";

interface ISignup {
  name: string;
  username: string;
  phone: string;
}

export const Signup = () => {
  SegureRoute();
  const socket = useSocket();
  const [form, setForm] = React.useState<ISignup>({
    name: "",
    username: "",
    phone: "",
  });

  const signup = socket.channel("post/users/signup", {
    onSuccess: openSession,
    onError: console.error,
  });

  const onChange = ({ target }: any) => {
    setForm((st) => ({ ...st, [target.name]: target.value }));
  };

  React.useEffect(() => {
    if (!socket || !signup) return;
    signup.on();
    return () => {
      if (!socket || !signup) return;
      signup.off();
    };
  }, [socket]);

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-md-6">
          <Form
            onSubmit={(data) => {
              if (!signup) return;
              console.log({ data });
              signup.emit({ data });
            }}
          >
            <div className="form-group mb-2">
              <label>Name</label>
              <input
                name={"name"}
                className="form-control"
                value={form.name}
                onChange={onChange}
              />
            </div>
            <div className="form-group mb-2">
              <label>Username</label>
              <input
                name={"username"}
                className="form-control"
                value={form.username}
                onChange={onChange}
              />
            </div>
            <div className="form-group mb-2">
              <label>Phone</label>
              <input
                name={"phone"}
                className="form-control"
                value={form.phone}
                onChange={onChange}
              />
            </div>
            <button type="submit" className="mt-3">
              Register
            </button>
            <Link type="submit" to={"/"} className="mt-3 mx-3">
              Signin
            </Link>
          </Form>
        </div>
      </div>
    </div>
  );
};
