import { error } from "console";
import cors from "cors";
import express, { Request, Response } from "express";
import mysql, { QueryError, RowDataPacket } from "mysql2/promise";

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
  app.get("/scores", (req: Request, res: Response) => {
    const validID =
      req.body.id && req.body.id.length > 0 && !isNaN(parseInt(req.body.id));
    if (!validID) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    connection
      .query("Select * from Scores WHERE user_id = ? ORDER BY score DESC;", [
        req.params.id,
      ])
      .then(([results]) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
      });
  });

  //get all scores by username
  app.get("/scores/:username", (req: Request, res: Response) => {
    const validUsername = req.params.username && req.params.username.length > 0;
    if (!validUsername) {
      res.status(400).json({ error: "Invalid Username" });
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

  // get all scores by game_name
  app.get("/scores/:game_name", (req: Request, res: Response) => {
    const validGameName =
      req.params.game_name && req.params.game_name.length > 0;
    if (!validGameName) {
      res.status(400).json({ error: "Invalid Game Name" });
      return;
    }
    connection
      .query("Select * from Scores WHERE game_name = ? ORDER BY score DESC", [
        req.params.game_name,
      ])
      .then(([results]) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
      });
  });

  //add score using user_id, game_name, and score
  app.post("/scores", (req: Request, res: Response) => {
    const { game_name, user_id, score } = req.body;
    const isUserIDValid =
      user_id && user_id.length > 0 && !isNaN(parseInt(user_id));
    const isGameNameValid = game_name && game_name.length > 0;
    const isScoreValid = score && score.length > 0 && !isNaN(parseInt(score));

    if (!isUserIDValid || !isGameNameValid || !isScoreValid) {
      res.status(400).json({
        error: "Missing parameters: Game Name, User ID, Score required",
      });
      return;
    }
    connection
      .execute(
        "INSERT INTO Scores (user_id, game_name, score) VALUES (?,?,?);",
        [user_id, game_name, score]
      )
      .then(() => {
        res.status(201).json({ message: "Score added" });
      })
      .catch((err: QueryError) => {
        console.error(err);
        if (err.code === "ER_DUP_ENTRY") {
          res.status(409).json({ error: "Score already exists" });
          return;
        }
        res.status(500).json({ error: "Database query failed" });
      });
  });

  //Update score using user_id, game_name, and score
  app.patch("/scores", (req: Request, res: Response) => {
    const { game_name, user_id, score } = req.body;
    const isUserIDValid =
      user_id && user_id.length > 0 && !isNaN(parseInt(user_id));
    const isGameNameValid = game_name && game_name.length > 0;
    const isScoreValid = score && score.length > 0 && !isNaN(parseInt(score));

    if (!isUserIDValid || !isGameNameValid || !isScoreValid) {
      res.status(400).json({
        error: "Missing parameters: Game Name, User ID, Score required",
      });
      return;
    }
    connection
      .execute(
        "UPDATE Scores SET score = ? WHERE user_id = ? AND game_name = ?;",
        [score, user_id, game_name]
      )
      .then(() => {
        res.status(201).json({ message: "Score updated" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
      });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
