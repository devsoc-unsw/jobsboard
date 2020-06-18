import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AdminAccount {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public hash: string;

  @Column({ type: "text", default: "no token set" })
  public latestValidToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
