import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { getJwtConfig } from '../config/jwtr.config'
import { RolesService } from '../roles/roles.service'
import { RolesModule } from '../roles/roles.module'
import { Reflector } from '@nestjs/core'
import { FileService } from '../file/file.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, Reflector, FileService],
  imports: [
    RolesModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class AuthModule {}
