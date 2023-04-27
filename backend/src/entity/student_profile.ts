import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Relation,
} from 'typeorm';
import Student from './student';

@Entity()
export default class StudentProfile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public hash: string;

  @OneToOne((_) => Student, (student) => student.studentProfile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public student: Relation<Student>;

  @Column({ type: 'text', default: 'no token set' })
  public latestValidToken: string;

  @Column({ type: 'text', default: 'no token set' })
  public latestValidResetToken: string;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
