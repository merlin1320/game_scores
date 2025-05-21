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
  app.options("/users", (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "*");
    res.send();
  });

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello, Express with TypeScript!");
  });

  app.get("/scores", (req: Request, res: Response) => {
    connection
      .query(
        "Select * from Scores INNER JOIN Users ON Scores.user_id=Users.id INNER JOIN UserTypes ON Users.user_type_id=UserTypes.id ORDER BY score DESC;"
      )
      .then(([results]) => {
        console.log(results)
        res.status(200).json(results);
        return;
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
      });
  });

  app.get("/scores", ())

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
