import { Column, Entity, ManyToMany, OneToMany } from 'typeorm'

import { ManyToOne } from 'typeorm';
import { Base } from '../../utils/base'
import { UserEntity } from '../../user/user.entity'
import { TrackEntity } from './track.entity'


@Entity('Listen')
export class ListenEntity extends Base {


	@ManyToOne(() => UserEntity, (user ) => user.history)
	fromUser: UserEntity

	@ManyToOne(() => TrackEntity, user => user.listens)
	toTrack: TrackEntity


}