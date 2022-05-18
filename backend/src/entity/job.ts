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
    enum: JobMode,
    default: JobMode.Onsite
  })
  public mode: JobMode;

  @Column({
    type: "set",
    enum: StudentDemographic,
    default: [StudentDemographic.All]
  })
  public studentDemographic: StudentDemographic[];

  @Column({
  type: "enum",
    enum: JobType,
    default: JobType.Intern
  })
  public jobType: JobType;

  @Column({
    type: "set",
    enum: WorkingRights,
    default: [WorkingRights.AusCtz, WorkingRights.AusPermRes] 
  })
  public workingRights: WorkingRights[];

  @Column({
    type: "enum",
    enum: WamRequirements,
    default: WamRequirements.None
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
