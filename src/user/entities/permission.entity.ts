import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sys_menu' })
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'menu_name' })
  menuName: string;

  @Column({
    name: 'parent_id',
  })
  parentId: number;

  @Column({ name: 'order_num' })
  orderNum: number;

  @Column()
  path: string;

  @Column()
  component: string;

  @Column({ name: 'is_frame' })
  isFrame: number;

  @Column({ name: 'menu_type' })
  menuType: string;

  @Column()
  visible: number;

  @Column()
  status: number;

  @Column()
  perms: string;

  @Column()
  icon: string;

  @Column()
  remark: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @Column({ name: 'create_by' })
  createBy: string;

  @Column({ name: 'update_by' })
  updateBy: string;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
