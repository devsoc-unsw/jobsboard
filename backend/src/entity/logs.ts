import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: "longtext"
  })
  public what: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}