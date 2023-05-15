import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import StudentProfile from './student_profile';

@Entity()
export default class Student {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public zID: string;
  
  @Column({ type: 'text', default: 'no token set' })
  public latestValidToken: string;
  
  @OneToOne((_) => StudentProfile, (studentProfile) => studentProfile.student)
  public studentProfile: StudentProfile;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
