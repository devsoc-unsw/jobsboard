import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import type Company from './company';

@Entity()
export default class CompanyAccount {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public hash: string;

  @OneToOne('Company', (company: Company) => company.companyAccount, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public company: Company;

  @Column({
    default: false,
  })
  public verified: boolean;

  @Column({ type: 'text', default: 'no token set' })
  public latestValidToken: string;

  @Column({ type: 'text', default: 'no token set' })
  public latestValidResetToken: string;

  @Column({
    default: true,
  })
  public official: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
