import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { Repository } from 'typeorm'
import { RoleEntity } from './roles entity'
import { CreateRoleDto } from './createRole.dto'

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(RoleEntity)
		private roleRepository: Repository<RoleEntity>,
	) {}

	async createRole(dto: CreateRoleDto) {
		const role = this.roleRepository.create(dto);
		return role;
	}


	async findOneByName(name: string) {
		const role = await this.roleRepository.findOne({ where: { name } });
		return role;
	}


	async addRoleToUser(userId: number, roleId: number): Promise<void> {
		const user = await this.userRepository.findOneById(userId);
		const role = await this.roleRepository.findOneById(roleId);

		if (user && role) {
			user.roles.push(role);
			await this.userRepository.save(user);
		}
	}

	async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
		const user = await this.userRepository.findOneById(userId);

		if (user) {
			user.roles = user.roles.filter(role => role.id !== roleId);
			await this.userRepository.save(user);
		}
	}

}
