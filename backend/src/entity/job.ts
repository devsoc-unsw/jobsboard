import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./company";
import { JobMode, StudentDemographic, JobType, WorkingRights, WamRequirements } from "../types/job-field";

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
    type: "set",
    enum: ["penultimate", "final_year", "all"],
    default: ["all"]
  })
  public studentDemographic: StudentDemographic[];

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
    ],
    default: ["aus_ctz", "aus_perm_res"]
  })
  public workingRights: WorkingRights[];

  @Column({
    type: "enum",
    enum: ["HD", "D", "C", "none"],
    default: "none"
  })
  public wamRequirements: WamRequirements;

  @Column({
    type: "longtext",
    default: ""
  })
  public additionalInfo: string;

  @Column({
    type: "longtext"
  })
  public description: string;

  @Column({
    default: "",
  })
  public applicationLink: string;
  
  @Column({
    default: true,
  })
  public isPaid: boolean;

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
