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
import { Permission } from './permission.entity';

@Entity({ name: 'sys_role' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_name' })
  roleName: string;

  @Column({ name: 'role_key' })
  roleKey: string;

  @Column({ name: 'role_sort' })
  roleSort: number;

  @Column()
  status: number;

  @Column({ name: 'del_flag' })
  delFlag: number;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @Column({ name: 'create_by' })
  createBy: string;

  @Column({ name: 'update_by' })
  updateBy: string;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'sys_role_menu' })
  permissions: Permission[];
}
