import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { TrackEntity } from './entity/track.entity'
import { CommentEntity } from './entity/comment.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from '../config/jwtr.config'
import { LikeEntity } from './entity/like.entity'
import { LikesToCommentEntity } from './entity/likesToComment'
import { FileService } from '../file/file.service'
import { ListenEntity } from './entity/listen.entyty'

@Module({
  controllers: [TrackController],
  providers: [TrackService, FileService],
  imports:[TypeOrmModule.forFeature([TrackEntity, CommentEntity, UserEntity, LikeEntity, LikesToCommentEntity, ListenEntity]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),]
})
export class TrackModule {}
