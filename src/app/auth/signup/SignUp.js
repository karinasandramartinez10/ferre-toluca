"use client";

import { Typography, Button } from "@mui/material";
import "./styles.css";

const SignUp = () => {
  return (
    <div className="container" id="container">
      <div className="form-container sign-up">
        <form>
          <Typography variant="h1">Crear cuenta</Typography>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <Button>Registrarse</Button>
        </form>
      </div>
      <div className="toggle-container-sign-up">
        <div className="toggle">
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <Button variant="secondary">Iniciar sesión</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
