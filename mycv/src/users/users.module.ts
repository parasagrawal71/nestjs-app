import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // IMPORTANT: This step creates a user repository for us
  // STEP 1_2: Link the entity to its parent module
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
