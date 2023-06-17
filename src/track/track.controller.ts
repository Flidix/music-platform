import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req, UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create.track.dto';
import { JwtAuthGuard } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/curentUser';
import { CreateCommentDto } from './dto/create-comment.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { TrackEntity } from './entity/track.entity'

@UseGuards(JwtAuthGuard)
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get('/TopHot')
  TopHot(){
    return this.trackService.TopHot()
  }
  @Get('search/:name')
  async searchTracksByName(@Param('name') name: string) {
    const tracks = await this.trackService.searchTracksByName(name);
    return tracks;
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'picture', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]))
  create(
    @CurrentUser('id') id: number,
    @UploadedFiles() files: { picture?: Express.Multer.File[], audio?: Express.Multer.File[] },
    @Body() dto: CreateTrackDto,
    @Req() req: any
  ) {
    const {picture, audio} = files
    const token = req.headers['authorization'].split(' ')[1];

    return this.trackService.create(dto, id, picture[0] , audio[0], token);
  }


  @Get('top')
  async getTop(): Promise<TrackEntity[]> {
    return this.trackService.getTop();
  }
  @Get('top-by-likes')
  async getTopByLikes(): Promise<TrackEntity[]> {
    return this.trackService.getTopByLikes();
  }

  @Get(':trackId')
  async getTrack(@Param('trackId') trackId: number, @Req() req: any) {
    const token = req.headers['authorization'].split(' ')[1];

    return this.trackService.byId(trackId, token);
  }


  @Delete(':trackId')
  async deleteTrack(@Param('trackId') trackId: number, @Req() req: any) {
    const token = req.headers['authorization'].split(' ')[1];
    return this.trackService.delete(trackId, token);
  }

  @Get()
  getAll() {
    return this.trackService.getAll();
  }

  @Post('comment')
  addComment(@Body() dto: CreateCommentDto, id: number, @Req() req: any) {
    const token = req.headers['authorization'].split(' ')[1];
    return this.trackService.addComment(dto, token);
  }
  @Patch('like/:trackId')
  async sub(@Param('trackId') trackId: number,  @Req() req: any){
    const token = req.headers['authorization'].split(' ')[1];
    return this.trackService.like(trackId, token)
  }

  @Patch('likeComment/:commentId')
  async likeToComment(@Param('commentId') commentId: number,  @Req() req: any){
    const token = req.headers['authorization'].split(' ')[1];
    return this.trackService.LikeComment(commentId, token)
  }
}
