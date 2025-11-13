import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres", 
  host: "localhost",
  port: 5433,
  username: "postgres",
  password: "hellodb",
  database: "POS",
  synchronize: true, // <-- IMPORTANT: auto-create tables // development only
  logging: false,
  entities: ["src/modules/**/entities/*.entity.ts"],
});
