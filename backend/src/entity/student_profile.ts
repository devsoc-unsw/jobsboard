import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { WamRequirements, WorkingRights } from '../types/job-field';

@Entity()
export default class StudentProfile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: () => "DATE_PART('YEAR', CURRENT_DATE)" })
  public gradYear: number;

  @Column({
    type: 'enum',
    enum: WamRequirements,
    default: WamRequirements.None,
  })
  public wam: WamRequirements;

  @Column({
    type: 'enum',
    enum: WorkingRights,
    default: WorkingRights.NoWr,
  })
  public workingRights: WorkingRights;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
