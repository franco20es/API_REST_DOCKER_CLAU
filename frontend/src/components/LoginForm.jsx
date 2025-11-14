import React, { useState } from "react";


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Datos "hardcodeados" (simulan estar en una base de datos)
    const user = {
      email: "admin@gmail.com",
      password: "123456",
    };

    if (email === user.email && password === user.password) {
      alert("Inicio de sesión exitoso ");
      onLogin(true); // Llama a la función del padre (App.js)
    } else {
      alert("Correo o contraseña incorrectos ");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;