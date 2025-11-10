import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Modifier } from "./modifier.entity.js";

@Entity("modifier_options")
export class ModifierOption {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  modifierId!: string;

  @ManyToOne(() => Modifier, (modifier) => modifier.options)
  modifier!: Modifier;

  @Column()
  name!: string;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  priceAdjustment!: number;

  @Column({ default: false })
  isDefault!: boolean;

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
