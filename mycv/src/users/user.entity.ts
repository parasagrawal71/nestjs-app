import { Exclude } from 'class-transformer';
import { Report } from '../reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

// STEP 1_1: Define an entity
// NOTE: Recommended to call it 'User' instead of 'UserEntity'
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude() // STEP 2_1: To exclude password from response object
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  // @AfterInsert()
  // logInsert() {
  //   console.log(`Inserted user with id: ${this.id}`);
  // }

  // @AfterUpdate()
  // logUpdate() {
  //   console.log(`Updated user with id: ${this.id}`);
  // }

  // @AfterRemove()
  // logRemove() {
  //   console.log(`Removed user with id: ${this.id}`);
  // }
}
