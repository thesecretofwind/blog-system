import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'sys_user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'nick_name' })
  nickName: string;

  @Column({ length: 50 })
  password: string;

  @Column()
  email: string;

  @Column()
  phonenumber: string;

  @Column()
  sex: number;

  @Column()
  avatar: string;

  @Column()
  type: number;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @Column({ name: 'create_by' })
  createBy: string;

  @Column({ name: 'update_by' })
  updateBy: string;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'sys_user_role' })
  roles: Role[];
}
