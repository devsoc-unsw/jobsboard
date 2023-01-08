import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export default class Statistics {
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
