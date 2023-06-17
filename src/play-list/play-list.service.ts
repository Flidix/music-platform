import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TrackEntity } from '../track/entity/track.entity'
import { Repository } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { CommentEntity } from '../track/entity/comment.entity'
import { LikeEntity } from '../track/entity/like.entity'
import { ListenEntity } from '../track/entity/listen.entyty'
import { LikesToCommentEntity } from '../track/entity/likesToComment'
import { FileService } from '../file/file.service'
import { JwtService } from '@nestjs/jwt'
import { CratePlayList } from './dto/crate play-list'
import { PlayListEntity } from './entity/play-list.entity'
import { UpdatePlayList } from './dto/update.play-list'

@Injectable()
export class PlayListService {
	constructor(@InjectRepository(TrackEntity) private readonly trackRepository :Repository<TrackEntity>,
							@InjectRepository(UserEntity) private readonly userRepository :Repository<UserEntity>,
							@InjectRepository(CommentEntity) private readonly commentRepository :Repository<CommentEntity>,
							@InjectRepository(LikeEntity) private readonly likeRepository :Repository<LikeEntity>,
							@InjectRepository(ListenEntity) private readonly listenRepository :Repository<ListenEntity>,
							@InjectRepository(PlayListEntity) private readonly playListRepository :Repository<PlayListEntity>,
							@InjectRepository(LikesToCommentEntity) private readonly likeToCommentRepository :Repository<LikesToCommentEntity>,
							private fileService: FileService,
							private readonly jwtService: JwtService) {}


	async createPlayLIst(dto: CratePlayList, token: string) {
		const {id} = await this.jwtService.verify(token)
		const user = await this.userRepository.findOneById(id)
		const playList = await this.playListRepository.create({
			name: dto.name,
			user: user
		});
		await this.userRepository.save(playList.user)
		await this.playListRepository.save(playList);

		return playList;
	}

	async UpdatePlayList(dto: UpdatePlayList, token: string){
		const {id} = await this.jwtService.verify(token)
		const user = await this.userRepository.findOneById(id)
		const playList = await this.playListRepository.findOne({
			where: {
				id: dto.playLIstId
			},
			relations:{
				user: true,
				tracks: true
			}
		})
		if (user.id !== playList.user.id){
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}
		const track = await this.trackRepository.findOneById(dto.trackId)
		playList.tracks = playList.tracks || [];
		playList.tracks.push(track)
		await this.playListRepository.save(playList)
		return playList
	}
	async getPlayListById(playListId: number, token: string){
		const {id} = await this.jwtService.verify(token)
		const user = await this.userRepository.findOneById(id)
		const playlist = await this.playListRepository.findOne({
			where: {
				id: playListId
			},
			relations:{
				user: true,
				tracks: true
			}
		})
		if (user.id !== playlist.user.id){
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}
		return playlist
	}
}
