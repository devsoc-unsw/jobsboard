import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Company} from "./company";

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public role: string;

  @Column()
  public description: string;

  @ManyToOne((type) => Company, (company) => company.jobs)
  public company: Company;
}
