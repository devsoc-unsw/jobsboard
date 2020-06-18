import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Company } from "./company";

@Entity()
export class CompanyAccount {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public hash: string;

  @OneToOne((_) => Company, company => company.companyAccount, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  public company: Company;

  @Column({
    default: false,
  })
  public verified: boolean;

  @Column({ type: "text", default: "no token set" })
  public latestValidToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
