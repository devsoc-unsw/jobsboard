import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Logs {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'text',
  })
  public what: string;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
