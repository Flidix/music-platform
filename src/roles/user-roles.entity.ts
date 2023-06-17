// role.entity.ts

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '../user/user.entity'
@Entity('UserRoles')
export class UserRolesEntity	{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	roleId: number;

	@Column()
	userId: number
}
