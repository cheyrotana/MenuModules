import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres", 
  host: "localhost",
  port: 3306,
  username: "root123",
  password: "yourpassword",
  database: "POS",
  synchronize: true, // <-- IMPORTANT: auto-create tables // development only
  logging: false,
  entities: ["src/modules/**/entities/*.entity.ts"],
});
