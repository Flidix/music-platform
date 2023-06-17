import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { Base } from '../../utils/base';
import { TrackEntity} from './track.entity'
import { UserEntity } from '../../user/user.entity'

@Entity('Comment')
export class CommentEntity extends Base {


	@Column()
	text: string;

	@Column({ nullable: true , default: 0})
	Likes: number

	@ManyToOne(() => UserEntity)
	user: UserEntity

	@ManyToOne(() => TrackEntity, track => track.comments)

	track: TrackEntity
}
