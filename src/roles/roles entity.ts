import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from '../user/user.entity'

@Entity('roles')
export class RoleEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => UserEntity, user => user.roles)
	@JoinTable()
	users: UserEntity[];
}
