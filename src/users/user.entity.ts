import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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
