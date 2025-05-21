import cors from "cors";
import express, { Request, Response } from "express";
import mysql from "mysql2/promise";

const app = express();
const port = 3030;

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

  app.options("/scores", (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "*");
    res.send();
  });

  //all scores
  app.get("/scores", (req: Request, res: Response) => {
    console.log("Initial");

    connection
      .query(
        "Select * from Scores INNER JOIN Users ON Scores.user_id=Users.id INNER JOIN UserTypes ON Users.user_type_id=UserTypes.id ORDER BY score DESC;"
      )
      .then(([results]) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
      });
  });

  //all scores for user by id
  app.get("/scores/:id", (req: Request, res: Response) => {
    if (
      !req.params.id ||
      req.params.id.length === 0 ||
      isNaN(parseInt(req.params.id))
    ) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    connection
      .query(
        "Select * from Scores INNER JOIN Users ON Scores.user_id=Users.id ORDER BY score DESC"
      )
      .then(([results]) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
      });
  });
  //get all scores by username
  app.get("/scores/:id", (req: Request, res: Response) => {
    if (
      !req.params.id ||
      req.params.id.length === 0 ||
      isNaN(parseInt(req.params.id))
    ) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    connection
      .query(
        "Select * from Scores INNER JOIN Users ON Scores.user_id=Users.id ORDER BY score DESC"
      )
      .then(([results]) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
      });
  });

  //get all scores by game
  // app.get("/scores", (req: Request, res: Response) => {
  //   const {game} = req.params.body
  //   if (
  //     !req.params.id ||
  //     req.params.id.length === 0 ||
  //     isNaN(parseInt(req.params.id))
  //   ) {
  //     res.status(400).json({ error: "Invalid ID" });
  //     return;
  //   }
  //   connection
  //     .query(
  //       "Select * from Scores INNER JOIN Users ON Scores.user_id=Users.id ORDER BY score DESC"
  //     )
  //     .then(([results]) => {
  //       res.status(200).json(results);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       res.status(500).json({ error: "Database query failed" });
  //     });
  // });



  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
