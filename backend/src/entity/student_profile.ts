import {
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import Student from './student';

@Entity()
export default class StudentProfile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public startYear: number;

  @Column({ default: 0 })
  public wam: number;

  @OneToOne((_) => Student, (student) => student.studentProfile, {
    onDelete: 'CASCADE',
  })
  public student: Student;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
