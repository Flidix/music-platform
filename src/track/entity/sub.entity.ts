import { Column, Entity, ManyToMany, OneToMany } from 'typeorm'

import { ManyToOne } from 'typeorm';
import { Base } from '../../utils/base'
import { UserEntity } from '../../user/user.entity'


@Entity('Subscription')
export class SubscriptionEntity extends Base {

	@ManyToOne(() => UserEntity, user => user.subscription)
	fromUser: UserEntity

	@ManyToOne(() => UserEntity, user => user.subscription)
	toChannel: UserEntity

}