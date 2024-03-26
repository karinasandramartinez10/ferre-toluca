"use client"
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import './style.css'

export const Login = () => {
  return (
    <div className="container" id="container">
      <div className={`form-container sign-in`}>
        <form>
          <Typography variant="h1">Iniciar sesión</Typography>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <a href="#">Forget Your Password?</a>
          <Button>Iniciar sesión</Button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>
              Register with your personal details to use all of site features
            </p>
            <Button variant="secondary">Registrarse</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
