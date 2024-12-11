import { Module } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ConfigModule } from '@nestjs/config';
// eslint-disable-next-line import/no-extraneous-dependencies
import { validate } from 'class-validator';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { UserModule } from './user/user.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      validate,
      load: [databaseConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        return new DataSource(options).initialize();
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'),
      serveRoot: '/static',
    }),
    UserModule,
    ChatModule,
  ],
  providers: [AppService],
})
export class AppModule {}
