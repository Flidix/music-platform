import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Base } from '../../utils/base';
import { UserEntity } from '../../user/user.entity';
import { TrackEntity } from '../../track/entity/track.entity'

@Entity('playList')
export class PlayListEntity extends Base {
	@Column()
	name: string

	@ManyToOne(() => UserEntity, (user) => user.playlists)
	user: UserEntity;

	@OneToMany(() => TrackEntity, (user) => user.playlists)
	tracks: TrackEntity[];
}
