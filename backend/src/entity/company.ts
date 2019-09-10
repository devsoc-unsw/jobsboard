import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Job} from "./job";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 100 })
  public name: string;

  @Column({ length: 255 })
  public location: string;

  @OneToMany((type) => Job, (job) => job.company)
  public jobs: Job[];
}
