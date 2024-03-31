import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      // database:
      //   process.env.NODE_ENV === 'test' ? 'test-db.sqlite' : 'db.sqlite',
      entities: [User, Report], // STEP 1_3: Link the entity to the app module
      synchronize: true, // IMPORTANT: Only for development environment. Automatically syncs SQL tables(for example, creates/deletes columns) based on entity files.
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // IMPORTANT: Alternative to app.useGlobalPipes used in main.ts
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // IMPORTANT: Trims extra properties from the body for security purpose
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asadasdewwecfsd'], // NOTE: Random string to encrypt cookies
        }),
      )
      .forRoutes('*'); // NOTE: `forRoutes('*')` means that it is a global middleware
  }
}
