import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TrackEntity } from '../track/entity/track.entity'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'
import { JwtService } from '@nestjs/jwt'
import { SubscriptionEntity } from '../track/entity/sub.entity'
import { RoleEntity } from '../roles/roles entity'
import { RolesService } from '../roles/roles.service'
import { AddRoleDto } from './add-role.dto'
import { BanUserDto } from './ban-user.dto'
import { addDays, subWeeks } from 'date-fns';
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai'
import readline from "readline";
import * as dotenv from 'dotenv';



@Injectable()
export class UserService {
	constructor(@InjectRepository(TrackEntity) private readonly trackRepository :Repository<TrackEntity>,
							@InjectRepository(UserEntity) private readonly userRepository :Repository<UserEntity>,
							@InjectRepository(SubscriptionEntity) private readonly subscriptionRepository :Repository<SubscriptionEntity>,
							@InjectRepository(RoleEntity) private readonly roleRepository :Repository<RoleEntity>,

							private readonly roleService: RolesService,
							private readonly jwtService: JwtService) {
		dotenv.config();
	}
	async searchTracksByName(username: string): Promise<UserEntity[]> {
		const user = await this.userRepository.createQueryBuilder('user')
			.where('LOWER(user.username) LIKE :username', { username: `%${username.toLowerCase()}%` })
			.getMany();
		return user;
	}
	async byId(id: number){
		const user = await this.userRepository.findOne({
			where:{
				id
			},
			relations:{
				tracks: true,
			},
		})
		if (!user) throw new NotFoundException("user not found")
		return user
	}
	async myProfile(id: number){
		const user = await this.userRepository.findOne({
			where:{
				id
			},
			relations:{
				tracks: true,
				favorites: {
					toTrack: true,
				},
				history:{
					toTrack: true
				},
				playlists: true
			},
			select:{
				playlists:{
					id: true,
					name: true,
					tracks: true
				}
			}
		})
		if (!user) throw new NotFoundException("user not found")
		return user
	}


	async getTrackSub(token: string) {
		const { id } = await this.jwtService.verify(token);

		// Визначення дати, яка відповідає початку останнього тижня
		const lastWeekStartDate = subWeeks(new Date(), 1);

		const user = await this.userRepository.findOne({
			where: {
				id
			},
			relations: {
				subscription: {
					toChannel: {
						tracks: {
							user: true
						}
					}
				}
			},
			order: {
				createdAt: 'DESC'
			}
		});

		if (user) {
			user.subscription.forEach((subscription) => {
				subscription.toChannel.tracks = subscription.toChannel.tracks.filter((track) => {
					return track.createdAt >= lastWeekStartDate;
				});
			});
			user.subscription = user.subscription.filter((subscription) => {
				return subscription.toChannel.tracks.length > 0;
			});
		}
		const tracks = user.subscription.map((subscription) => subscription.toChannel.tracks);

		return tracks;
	}

	async subscribe(channelId:number, token: string){
		const {id} = await this.jwtService.verify(token)
		const userFrom = await this.userRepository.findOneById(id)
		const toUser = await this.userRepository.findOneById(channelId)
		const data ={
			toChannel: {id: channelId},
			fromUser: {id}
		}
		const isSub = await this.subscriptionRepository.findOneBy(data)
		if (isSub){
			await this.subscriptionRepository.delete(data)
			toUser.subscribersCount--
			await this.userRepository.save(toUser)
			return false
		}
		if (!isSub) {
			const newSub = await this.subscriptionRepository.create(data)
			toUser.subscribersCount++
			userFrom.subscription = userFrom.subscription || [];
			userFrom.subscription.push(newSub)
			await this.userRepository.save(toUser)
			await this.subscriptionRepository.save(newSub)
		}
		return true
	}

	async getAll(){
		return this.userRepository.find()
	}

	async addRole(dto: AddRoleDto) {
		const user = await this.userRepository.findOneById(dto.userId);
		const role = await this.roleService.findOneByName(dto.name)
		if (user && role) {
			user.roles = [role]; // Встановлюємо роль користувачу
			await this.userRepository.save(user); // Зберігаємо зміни
			return user;
		}
		throw new HttpException('користувач чи роль не знайдені', HttpStatus.NOT_FOUND);
	}

	async banUser(dto: BanUserDto){
		const user = await this.userRepository.findOneById(dto.userId)
		user.banned = true
		user.banReason = dto.banReason
		await this.userRepository.save(user)
		return user
	}
	// async chatGpt(message: string) {
	// 	try {
	// 		dotenv.config();
	//
	// 		const apiKey = process.env.API_KEY;
	// 		const ai = new OpenAIApi(new Configuration({ apiKey }));
	// 		const messages = [{ role: ChatCompletionRequestMessageRoleEnum.User, content: message }];
	//
	// 		const res = await ai.createChatCompletion({ model: 'gpt-3.5-turbo', messages });
	// 		const context = res.data.choices[0].message.content;
	// 		return context
	// 	} catch (error) {
	// 		console.error('An error occurred:', error);
	// 		throw new Error('Failed to get AI response');
	// 	}
	// }
}
