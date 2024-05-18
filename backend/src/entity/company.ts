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
import type Job from './job';
import type CompanyAccount from './company_account';

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

  @OneToMany('Job', (job: Job) => job.company, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public jobs: Job[];

  // ! dependency cycle resolved using fix:
  // https://orkhan.gitbook.io/typeorm/docs/relations-faq#avoid-circular-import-errors
  @OneToOne('CompanyAccount', (companyAccount: CompanyAccount) => companyAccount.company)
  public companyAccount: CompanyAccount;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
