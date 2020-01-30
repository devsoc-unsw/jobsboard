import { Column, Entity, OneToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
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
  public company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
