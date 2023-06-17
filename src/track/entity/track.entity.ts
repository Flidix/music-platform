import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Base } from '../../utils/base';
import { CommentEntity } from './comment.entity';
import { UserEntity } from '../../user/user.entity';
import { PlayListEntity } from '../../play-list/entity/play-list.entity'

@Entity('Track')
export class TrackEntity extends Base {


	@Column()
	name: string;

	@Column()
	description: string;

	@Column({ default: 0 })
	listens: number;


	@Column({ nullable: true, default: 0 })
	Likes: number;

	@Column()
	picture: string;

	@Column()
	audio: string;


	@ManyToOne(() => UserEntity, user => user.tracks)
	user: UserEntity;

	@OneToMany(() => CommentEntity, comment => comment.track)
	comments: CommentEntity[];

	@ManyToOne(() => PlayListEntity, (playList) => playList.tracks)
	playlists: PlayListEntity[];

}
