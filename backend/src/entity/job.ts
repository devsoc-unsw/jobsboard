import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./company";
import { JobMode, StudentDemographic, JobType, WorkingRights } from "../types/job_field";

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public role: string;

  @Column({
    type: "enum",
    enum: ["onsite", "hybrid", "remote"]
  })
  public mode: JobMode;

  @Column({
    type: "enum",
    enum: ["penultimate", "final_year", "all"]
  })
  public studentDemographic: StudentDemographic;

  @Column({
    type: "enum",
    enum: ["intern", "grad"]
  })
  public jobType: JobType;

  @Column({
    type: "set",
    enum: [
      "aus_ctz",
      "aus_perm_res",
      "aus_stud_visa",
      "aus_temp_grad_visa",
      "nz_ctz_and_perm_res",
      "no_wr",
      "all"
    ]
  })
  public workingRights: WorkingRights[];

  @Column({
    type: "longtext"
  })
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

  @Column({
    default: false,
  })
  public deleted: boolean;

  @Column({
    default: false,
  })
  public adminCreated: boolean;

  @Column({
    default: null,
  })
  public expiry: Date;

  @ManyToOne((_) => Company, (company) => company.jobs)
  public company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
