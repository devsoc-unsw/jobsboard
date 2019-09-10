import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public zID: string;

  @Column({
    default: false,
  })
  public isAdmin: boolean;
}
