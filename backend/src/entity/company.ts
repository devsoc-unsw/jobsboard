import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import Job from './job';
import CompanyAccount from './company_account';

@Entity()
export default class Company {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 100 })
  public name: string;

  @Column({ length: 255 })
  public location: string;

  @Column({
    default: 'No company description',
    length: 4096,
  })
  public description: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  public logo: string;

  @Column({
    default: false,
  })
  public sponsor: boolean;

  @OneToMany((_) => Job, (job) => job.company, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public jobs: Job[];

  // ! this is a depdency cycle problem
  @OneToOne((_) => CompanyAccount, (companyAccount) => companyAccount.company)
  public companyAccount: CompanyAccount;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
