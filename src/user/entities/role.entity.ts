import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";

@Entity()
export class Role {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @CreateDateColumn()
  createTime: Date;

  @CreateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Permission)
  @JoinTable({name: 'role_permission_relation'})
  permissions: Permission[]
}