import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Note {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
