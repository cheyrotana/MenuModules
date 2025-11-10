import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ModifierOption } from "./modifierOption.entity.js";
import { ItemModifierMap } from "./itemModifierMap.entity.js";

@Entity("modifiers")
export class Modifier {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  tenantId!: string;

  @Column()
  name!: string;

  @Column({ type: "varchar", length: 20 })
  selectionType!: "single" | "multi";

  @OneToMany(() => ModifierOption, (option) => option.modifier)
  options!: ModifierOption[];

  @OneToMany(() => ItemModifierMap, (map) => map.modifier)
  menuItemMappings!: ItemModifierMap[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
