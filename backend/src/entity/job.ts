import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./company";

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public role: string;

  @Column()
  public description: string;

  @Column({
    default: "",
  })
  public applicationLink: string;

  @Column({
    default: false,
  })
  public approved: boolean;

  @Column({
    default: false,
  })
  public hidden: boolean;

  @ManyToOne((_) => Company, (company) => company.jobs)
  public company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
