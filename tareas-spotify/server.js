import express from "express";
import app from "./server/src/app.js";

// Vercel detects Express from a supported entrypoint that imports
// the package and exports the app without starting a listener.
void express;

export default app;
