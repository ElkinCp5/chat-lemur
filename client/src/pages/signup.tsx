import React from "react";
import Cookies from "js-cookie";
import { Form } from "../components";
import { useSocket } from "../components/provider";

interface ISignup {
  name: string;
  username: string;
  phone: string;
}

export const Signup = () => {
  const socket = useSocket();
  const [form, setForm] = React.useState<ISignup>({
    name: "",
    username: "",
    phone: "",
  });

  const signup = socket.channel("post/users/signup", {
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
    if (!socket || !signup) return;
    signup.on();
    return () => {
      if (!socket || !signup) return;
      signup.off();
    };
  }, [socket]);

  return (
    <div className="register">
      <h2>Register</h2>
      <Form
        onSubmit={(data) => {
          if (!signup) return;
          console.log({ data });
          signup.emit({ data });
        }}
      >
        <div>
          <label>Name</label>
          <input name={"name"} value={form.name} onChange={onChange} />
        </div>
        <div>
          <label>Username</label>
          <input name={"username"} value={form.username} onChange={onChange} />
        </div>
        <div>
          <label>Phone</label>
          <input name={"phone"} value={form.phone} onChange={onChange} />
        </div>
        <button type="submit">Register</button>
      </Form>
    </div>
  );
};
