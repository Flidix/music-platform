import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Base } from '../utils/base';
import { TrackEntity } from '../track/entity/track.entity';
import { SubscriptionEntity } from '../track/entity/sub.entity';
import { RoleEntity } from '../roles/roles entity';
import { LikeEntity } from '../track/entity/like.entity'
import { ListenEntity } from '../track/entity/listen.entyty'
import { PlayListEntity } from '../play-list/entity/play-list.entity'

@Entity('User')
export class UserEntity extends Base {
    @Column()
    email: string;

    @Column({ select: false })
    password: string;

    @Column()
    username: string;

    @Column({ nullable: true })
    avatarPath: string;

    @Column({ nullable: true, default: 0 })
    subscribersCount: number;

    @Column({ default: false })
    banned: boolean;

    @Column({ default: '' })
    banReason: string;

    @OneToMany(() => TrackEntity, (track) => track.user)
    tracks: TrackEntity[];


    @OneToMany(() => LikeEntity, (like) => like.toTrack)
    favorites: LikeEntity[]

    @OneToMany(() => ListenEntity, (like) => like.toTrack)
    history: ListenEntity[]

    @OneToMany(() => PlayListEntity, (playlist) => playlist.user)
    playlists: PlayListEntity[];


    @OneToMany(() => SubscriptionEntity, (sub) => sub.fromUser)
    subscription: SubscriptionEntity[];

    @OneToMany(() => SubscriptionEntity, (sub) => sub.toChannel)
    subscribers: SubscriptionEntity[];

    @ManyToMany(() => RoleEntity, role => role.users)
    @JoinTable()
    roles: RoleEntity[];
}
