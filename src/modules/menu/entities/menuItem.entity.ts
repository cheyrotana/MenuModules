import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Category } from "./category.entity.js";
import { ItemModifierMap } from "./itemModifierMap.entity.js";
import { MenuStockMap } from "./menuStockMap.entity.js";

@Entity("menu_items")
export class MenuItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  tenantId!: string;

  @Column()
  categoryId!: string;

  @ManyToOne(() => Category, (category) => category.menuItems)
  category!: Category;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  createdBy?: string;

  @OneToMany(() => ItemModifierMap, (map) => map.menuItem)
  modifierMappings!: ItemModifierMap[];

  @OneToMany(() => MenuStockMap, (map) => map.menuItem)
  stockMappings!: MenuStockMap[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
