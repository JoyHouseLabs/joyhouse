import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  id: string;

  @Column({ type: "varchar", length: 64, unique: true })
  username: string;

  @Column({ type: "varchar", length: 128 })
  password: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  nickname: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatar: string; // 头像文件名或URL

  @Column({ type: "varchar", length: 255, nullable: true })
  remark: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
