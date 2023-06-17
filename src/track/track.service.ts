import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { ILike, Like, MoreThan, Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { TrackEntity } from './entity/track.entity'
import { CreateTrackDto } from './dto/create.track.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { CommentEntity } from './entity/comment.entity'
import { LikeEntity } from './entity/like.entity'
import { LikesToCommentEntity } from './entity/likesToComment'
import { FileService, FileTypes } from '../file/file.service'
import { ListenEntity } from './entity/listen.entyty'
import { subWeeks } from 'date-fns'

@Injectable()
export class TrackService {
	constructor(@InjectRepository(TrackEntity) private readonly trackRepository :Repository<TrackEntity>,
							@InjectRepository(UserEntity) private readonly userRepository :Repository<UserEntity>,
							@InjectRepository(CommentEntity) private readonly commentRepository :Repository<CommentEntity>,
							@InjectRepository(LikeEntity) private readonly likeRepository :Repository<LikeEntity>,
							@InjectRepository(ListenEntity) private readonly listenRepository :Repository<ListenEntity>,

							@InjectRepository(LikesToCommentEntity) private readonly likeToCommentRepository :Repository<LikesToCommentEntity>,
							private fileService: FileService,
							private readonly jwtService: JwtService) {}

	async TopHot(): Promise<TrackEntity[]> {
		const lastWeekStartDate = subWeeks(new Date(), 1);

		const tracks = await this.trackRepository.createQueryBuilder('track')
			.leftJoinAndSelect('track.user', 'user')
			.where('track.createdAt >= :lastWeekStartDate', { lastWeekStartDate })
			.orderBy('track.listens', 'DESC') // Сортування за кількістю прослуховувань у спадаючому порядку
			.getMany();

		return tracks;
	}


	async searchTracksByName(name: string): Promise<TrackEntity[]> {
		const tracks = await this.trackRepository.createQueryBuilder('track')
			.leftJoinAndSelect('track.user', 'user')
			.where('LOWER(track.name) LIKE :name', { name: `%${name.toLowerCase()}%` })
			.getMany();
		return tracks;
	}


	async byId(trackId: number, token: string) {
		const { id } = await this.jwtService.verify(token);
		const user = await this.userRepository.findOneById(id);
		await this.checkBanStatus(id);

		const track = await this.trackRepository.findOne({
			where: {
				id: trackId
			},
			relations: {
				user: true,
				comments: {
					user: true
				}
			},
			select: {
				user: {
					id: true,
					username: true,
					email: true
				},
				comments: {
					id: true,
					text: true,
					Likes: true,
					user: {
						id: true,
						username: true,
						email: true
					}
				}
			}
		});

		if (!track) {
			throw new NotFoundException('Track not found');
		}

		const listen = await this.listenRepository.create({
			fromUser: user,
			toTrack: track
		})
		user.history = user.history || [];
		user.history.push(listen)


		track.listens++;


		await this.listenRepository.save(listen)
		await this.userRepository.save(user);
		await this.trackRepository.save(track);

		return track;
	}


	async getTop(): Promise<TrackEntity[]> {

		const tracks = await this.trackRepository.find({
			order: {
				listens: 'DESC'
			},
			take: 10 // Обмеження до 10 треків
		});

		return tracks;
	}

	async getTopByLikes(): Promise<TrackEntity[]> {

		const tracks = await this.trackRepository.find({
			order: {
				Likes: 'DESC'
			},
			take: 10 // Обмеження до 10 треків
		});

		return tracks;
	}
	async delete(trackId: number, token: string) {
		const { id } = await this.jwtService.verify(token);
		const user = await this.userRepository.findOneById(id);
		const track = await this.byId(trackId, token)
		if (!track){
			return new NotFoundException('not found')
		}

		if (user.id !== track.user.id) {
			return { message: 'ти можеш видалити тільки свої треки' };
		}

		await this.trackRepository.remove(track)
		return track;
	}

	async getAll() {
		return this.trackRepository.find({ relations: ['user'] });
	}

	async addComment(dto: CreateCommentDto, token: string) {
		const { id } = await this.jwtService.verify(token);
		await this.checkBanStatus(id);

		const newComment = this.commentRepository.create({
			text: dto.text,
			track: { id: dto.trackId },
			user: { id: id }
		});

		return this.commentRepository.save(newComment);
	}

	async checkBanStatus(id: number) {
		const user = await this.userRepository.findOneById(id);
		if (user.banned) {
			throw new HttpException(`Ти забанений по причині: ${user.banReason}`, HttpStatus.BAD_REQUEST);
		}
	}


	async create(dto: CreateTrackDto, userId: number, picture, audio, token: string) {
		const { id } = await this.jwtService.verify(token);
		await this.checkBanStatus(id);
		const audioPath = this.fileService.createFile(FileTypes.AUDIO, audio);
		const picturePath = this.fileService.createFile(FileTypes.IMAGE, picture);
		const user = await this.userRepository.findOneById(userId);

		const track = this.trackRepository.create({...dto, user, audio: audioPath, picture: picturePath});
		track.listens = 0;

		await this.trackRepository.save(track);
		return track;
	}
	async like(trackId: number, token: string) {
		const { id } = await this.jwtService.verify(token);
		const user = await this.userRepository.findOneById(id);
		const track = await this.byId(trackId, token)

		const data = {
			toTrack: { id: trackId },
			fromUser: { id },
		};

		const isLiked = await this.likeRepository.findOne({ where: data });

		if (isLiked) {
			await this.likeRepository.remove(isLiked);
			track.Likes--;
			return false;
		} else {
			const newLike = this.likeRepository.create(data);
			await this.likeRepository.save(newLike);
			track.Likes++;
			await this.trackRepository.save(track);

			// Переконайтеся, що поле favorites ініціалізовано як масив
			user.favorites = user.favorites || [];
			user.favorites.push(newLike);
			await this.userRepository.save(user);

			return true;
		}
	}




		async LikeComment(commentId:number, token: string){
		const {id} = await this.jwtService.verify(token)
		const comment = await this.commentRepository.findOneById(commentId)
		const data ={
			toComment: {id: commentId},
			fromUser: {id}
		}
		const isSub = await this.likeToCommentRepository.findOneBy(data)
		if (isSub){
			await this.likeToCommentRepository.delete(data)
			comment.Likes--
			await this.commentRepository.save(comment)
			return false
		}
		if (!isSub) {
			const newSub = await this.likeToCommentRepository.create(data)
			comment.Likes++
			await this.commentRepository.save(comment)
			await this.likeToCommentRepository.save(newSub)
		}
		return true
	}
}
