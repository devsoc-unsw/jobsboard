import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Relation,
} from 'typeorm';
import StudentProfile from './student_profile';

@Entity()
export default class Student {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public zID: string;

  @OneToOne((_) => StudentProfile, (studentProfile) => studentProfile.student)
  public studentProfile: Relation<StudentProfile>

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
