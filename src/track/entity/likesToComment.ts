import { Column, Entity, ManyToMany, OneToMany } from 'typeorm'

import { ManyToOne } from 'typeorm';
import { Base } from '../../utils/base'
import { UserEntity } from '../../user/user.entity'
import { TrackEntity } from './track.entity'
import { CommentEntity } from './comment.entity'


@Entity('LikeToComment')
export class LikesToCommentEntity extends Base {

	@ManyToOne(() => UserEntity)
	fromUser: UserEntity

	@ManyToOne(() => CommentEntity, user => user.Likes)
	toComment: CommentEntity

}