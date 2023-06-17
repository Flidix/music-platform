import { Module } from '@nestjs/common';
import { PlayListService } from './play-list.service';
import { PlayListController } from './play-list.controller';
import { TrackController } from '../track/track.controller'
import { TrackService } from '../track/track.service'
import { FileService } from '../file/file.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TrackEntity } from '../track/entity/track.entity'
import { CommentEntity } from '../track/entity/comment.entity'
import { UserEntity } from '../user/user.entity'
import { LikeEntity } from '../track/entity/like.entity'
import { LikesToCommentEntity } from '../track/entity/likesToComment'
import { ListenEntity } from '../track/entity/listen.entyty'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from '../config/jwtr.config'
import { PlayListEntity } from './entity/play-list.entity'

// @ts-ignore
@Module({
  controllers: [TrackController, PlayListController],
  providers: [TrackService, FileService, PlayListService],
  imports:[TypeOrmModule.forFeature([TrackEntity, CommentEntity, UserEntity, LikeEntity, LikesToCommentEntity, ListenEntity, PlayListEntity]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),]
})
export class PlayListModule {}
