import express from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import { RegisterRoutes } from "./routes/routes";

export const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
  origin: '*',
  methods: 'GET,POST,DELETE,PATCH',
  credentials: true,
}))

RegisterRoutes(app);