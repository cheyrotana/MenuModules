import { AppDataSource } from "../core/database/dataSource.js";

AppDataSource.initialize()
  .then(() => {
    console.log(" Database Connected!");
  })
  .catch((err: unknown) => {
    console.error("Database Connection Failed", err);
  });
