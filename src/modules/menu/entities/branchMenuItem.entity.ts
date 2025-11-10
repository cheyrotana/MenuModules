import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { MenuItem } from "./menuItem.entity.js";

@Entity("branch_menu_items")
export class BranchMenuItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  branchId!: string;

  @Column()
  menuItemId!: string;

  @ManyToOne(() => MenuItem)
  menuItem!: MenuItem;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  customPrice?: number;

  @Column({ default: true })
  isAvailable!: boolean;

  @Column({ type: "int", default: 0 })
  displayOrder!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
