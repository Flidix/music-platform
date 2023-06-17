import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { PlayListService } from './play-list.service';
import { UpdatePlayList } from './dto/update.play-list'
import { CratePlayList } from './dto/crate play-list'
import { AuthGuard } from '@nestjs/passport'
import { JwtAuthGuard } from '../auth/decorators/auth.decorator'

@Controller('play-list')
@UseGuards(JwtAuthGuard)
export class PlayListController {
  constructor(private readonly playListService: PlayListService) {}

  @Post('/createPlayList')
  createPlayList(@Body() dto: CratePlayList,  @Req() req: any) {
    const token = req.headers['authorization'].split(' ')[1];
    return this.playListService.createPlayLIst(dto, token);
  }


  @Post('/updatePlayList')
  updatePlayList(@Body() dto: UpdatePlayList, @Req() req: any){
    const token = req.headers['authorization'].split(' ')[1];
    return this.playListService.UpdatePlayList(dto, token)
  }
  @Get(':playListId')
  async getById(@Param('playListId') playListId: number, @Req() req: any) {
    const token = req.headers['authorization'].split(' ')[1];

    return this.playListService.getPlayListById(playListId ,token);
  }
}
