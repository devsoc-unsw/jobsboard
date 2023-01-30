import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class MailRequest {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public sender: string;

  @Column()
  public recipient: string;

  @Column({
    type: 'text',
    default: '',
  })
  public subject: string;

  @Column({
    type: 'text',
    default: '',
  })
  public content: string;

  @Column({
    default: false,
  })
  public sent: boolean;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
