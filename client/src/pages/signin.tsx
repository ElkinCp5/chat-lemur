import React from "react";

export const Signin = () => {
  const [username, setUsername] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Lógica de autenticación
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
