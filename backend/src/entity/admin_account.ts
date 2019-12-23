import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class AdminAccount {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public hash: string;
}
