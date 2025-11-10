import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { MenuItem } from "./menuItem.entity.js";

@Entity("menu_stock_map")
export class MenuStockMap {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  menuItemId!: string;

  @ManyToOne(() => MenuItem, (item) => item.stockMappings)
  menuItem!: MenuItem;

  @Column()
  stockItemId!: string; // references Inventory module table

  @Column("decimal", { precision: 10, scale: 2 })
  qtyPerSale!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
