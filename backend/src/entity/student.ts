import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Student {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public zID: string;

  @Column({ type: 'text', default: 'no token set' })
  public latestValidToken: string;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
