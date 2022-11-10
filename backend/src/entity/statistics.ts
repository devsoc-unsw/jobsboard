import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Statistics {
  @PrimaryColumn()
  public year: number;

  @Column({
    default: 0,
  })
  public numJobPosts: number;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
