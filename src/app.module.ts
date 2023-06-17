import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {getTypeOrmConfig} from "./config/typeorm.config";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TrackModule } from './track/track.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static'
import { RolesModule } from './roles/roles.module';
import { PlayListModule } from './play-list/play-list.module';
import * as path from 'path'


@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: path.resolve(__dirname, 'static'), }),
      ConfigModule.forRoot(),
      TypeOrmModule.forRootAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory: getTypeOrmConfig
      }),
      UserModule,
      AuthModule,
      TrackModule,
      FileModule,
      RolesModule,
      PlayListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
