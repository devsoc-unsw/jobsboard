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
import { Job } from './job';
import { CompanyAccount } from './company_account';

@Entity()
export class Company {
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
    type: 'bytea',
    nullable: true,
  })
  public logo: Buffer;

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

  @OneToOne((_) => CompanyAccount, (companyAccount) => companyAccount.company)
  public companyAccount: CompanyAccount;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
