import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { TrackEntity } from '../track/entity/track.entity'
import { CommentEntity } from '../track/entity/comment.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from '../config/jwtr.config'
import { SubscriptionEntity } from '../track/entity/sub.entity'
import { FileService } from '../file/file.service'
import { RoleEntity } from '../roles/roles entity'
import { RolesModule } from '../roles/roles.module'
import { RolesService } from '../roles/roles.service'
import { UserRolesEntity } from '../roles/user-roles.entity'
import { RolesGuard } from '../auth/decorators/role.guard'
import { Reflector } from '@nestjs/core'

@Module({
  controllers: [UserController],
  providers: [UserService, FileService, RolesService, RolesGuard, Reflector],
  imports:[RolesModule,
    TypeOrmModule.forFeature([TrackEntity, CommentEntity, UserEntity, SubscriptionEntity, RoleEntity, UserRolesEntity]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),]

})
export class UserModule {}
