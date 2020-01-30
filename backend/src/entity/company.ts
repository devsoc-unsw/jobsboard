import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Job } from "./job";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 100 })
  public name: string;

  @Column({ length: 255 })
  public location: string;

  @Column({
    default: "No company description",
    length: 4096,
  })
  public description: string;

  @OneToMany((_) => Job, (job) => job.company, {
    cascade: true,
    onDelete: "CASCADE",
  })
  public jobs: Job[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
