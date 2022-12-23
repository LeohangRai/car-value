import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  OneToMany,
  AfterRemove
} from 'typeorm';
import { Report } from 'src/reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  printCreatedUserId() {
    console.log('New User ID:', this.id);
  }

  @AfterUpdate()
  printUpdatedUserId() {
    console.log('Updated User ID:', this.id);
  }

  @AfterRemove()
  printRemovedUserId() {
    console.log('Deleted User ID:', this.id);
  }
}
