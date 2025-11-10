import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { MenuItem } from "./menuItem.entity.js";
import { Modifier } from "./modifier.entity.js";

@Entity("item_modifier_map")
export class ItemModifierMap {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  menuItemId!: string;

  @ManyToOne(() => MenuItem, (item) => item.modifierMappings)
  menuItem!: MenuItem;

  @Column()
  modifierId!: string;

  @ManyToOne(() => Modifier, (modifier) => modifier.menuItemMappings)
  modifier!: Modifier;

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
