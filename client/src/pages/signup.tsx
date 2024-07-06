import React from "react";
import { Form } from "../components";

export const Signup = () => {
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Lógica de registro
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <Form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </Form>
    </div>
  );
};
