import express, { Request, Response } from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const port = 3020;

const getConnection = () => {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "mysql-chal",
    password: "pens",
    port: 3306,
  });
};

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

getConnection().then((connection) => {
  app.use(cors(corsOptions));
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello, Express with TypeScript!");
  });

  app.options("/users", (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "*");
    res.send();
  });
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});