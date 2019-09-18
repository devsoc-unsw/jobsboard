import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Company} from "./company";

@Entity()
export class CompanyAccount {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public hash: string;

  @OneToOne((type) => Company, {
    cascade: true,
    onDelete: "CASCADE",
  })
  public company: Company;
}
