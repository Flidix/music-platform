import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { Repository } from 'typeorm'
import { JwtStrategy } from './jwt.strategy'
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth-dto'
import {compare, hash, genSalt} from 'bcryptjs'
import bcrypt from 'bcryptjs';
import { RolesService } from '../roles/roles.service'
import { CreateTrackDto } from '../track/dto/create.track.dto'
import { FileService, FileTypes } from '../file/file.service'



@Injectable()
export class AuthService {
	constructor(@InjectRepository(UserEntity) private readonly userRepository :Repository<UserEntity>,
							private readonly roleService: RolesService,
							private fileService: FileService,

							private readonly jwtService: JwtService) {}




	async login (dto: AuthDto){

		const user = await this.validateUser(dto)

		return{
			user: {id:user.id, email:user.email, username: user.username},
			accessToken: await this.issueAccessToken(user)
		}
	}


	async register (dto: AuthDto, avatarPath){
		const avatar = this.fileService.createFile(FileTypes.AVATAR, avatarPath)
		const oldUser = await this.userRepository.findOneBy({email:dto.email})
		const oldUser2 = await this.userRepository.findOneBy({username: dto.username})
		const role = await this.roleService.findOneByName("USER");

		if (oldUser) throw new BadRequestException('email зайнятий')
		if (oldUser2) throw new BadRequestException('username зайнятий')

		const salt = await genSalt(10);

		const newUser = await this.userRepository.create({
			email: dto.email,
			password: await hash(dto.password, salt),
			username: dto.username,
			avatarPath: avatar,
			roles: [role], // Призначаємо роль "USER" новому користувачу
		});

		const user = await this.userRepository.save(newUser)
		return{
			user: {id:user.id, email:user.email, username: user.username, avatarPath: user.avatarPath, roles: user.roles},
			accessToken: await this.issueAccessToken(user)
		}
	}





	async validateUser(dto: AuthDto) {
		const user = await this.userRepository.findOne({
			where: { email: dto.email, username:dto.username},
			select: ['id', 'email', 'password', 'username'], // Додайте поле "password" для перевірки пароля
		});
		if (!user) throw new NotFoundException('not found');

		const isValidPassword = await compare(dto.password, user.password);
		if (!isValidPassword) throw new UnauthorizedException('неправильний пароль');

		return user;
	}


	async issueAccessToken(user: UserEntity){
		const data = {
			id:user.id,
			roles: user.roles
		}
		return await this.jwtService.signAsync(data, {
			expiresIn: '31d'
		})
	}

	async returnUserFields(user: UserEntity) {
		return {
			user: {id:user.id, email:user.email, username: user.username}
		};
	}
}
