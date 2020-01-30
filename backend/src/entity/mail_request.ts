import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MailRequest {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public sender: string;

  @Column()
  public recipient: string;

  @Column({
    default: ""
  })
  public subject: string;

  @Column({
    default: ""
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
