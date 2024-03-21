import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// STEP 1_1: Define an entity
// NOTE: Recommended to call it 'User' instead of 'UserEntity'
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
