import { Column, Entity, ManyToMany, OneToMany } from 'typeorm'

import { ManyToOne } from 'typeorm';
import { Base } from '../../utils/base'
import { UserEntity } from '../../user/user.entity'
import { TrackEntity } from './track.entity'


@Entity('Like')
export class LikeEntity extends Base {

	@ManyToOne(() => UserEntity,  (like) => like.favorites)
	fromUser: UserEntity

	@ManyToOne(() => TrackEntity, user => user.Likes)
	toTrack: TrackEntity

}