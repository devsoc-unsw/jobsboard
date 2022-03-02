

import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { CompanyAccount } from "./company_account";

@Entity()
export class ActiveResetTokens {
    @PrimaryGeneratedColumn()
    public tokenId: number;

    @OneToOne(() => CompanyAccount)
    @JoinColumn()
    name: CompanyAccount;

    @Column({ nullable: false })
    public token: string;

    @Column({ type: 'datetime', nullable: false })
    public expiry: Date;
}

