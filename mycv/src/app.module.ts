import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   // database:
    //   //   process.env.NODE_ENV === 'test' ? 'test-db.sqlite' : 'db.sqlite',
    //   entities: [User, Report], // STEP 1_3: Link the entity to the app module
    //   synchronize: true, // IMPORTANT: Only for development environment. Automatically syncs SQL tables(for example, creates/deletes columns) based on entity files.
    // }),
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
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')], // NOTE: Random string to encrypt cookies
        }),
      )
      .forRoutes('*'); // NOTE: `forRoutes('*')` means that it is a global middleware
  }
}
