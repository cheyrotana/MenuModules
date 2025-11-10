import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { MenuItem } from "./menuItem.entity.js";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  tenantId!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "int", default: 0 })
  displayOrder!: number;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => MenuItem, (item) => item.category)
  menuItems!: MenuItem[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
