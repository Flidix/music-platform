import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/curentUser'
import { JwtAuthGuard } from '../auth/decorators/auth.decorator'
import { Roles } from '../auth/decorators/role-auth.guard'
import { AddRoleDto } from './add-role.dto'
import { RolesGuard } from '../auth/decorators/role.guard'
import { BanUserDto } from './ban-user.dto'
import { throwIfEmpty } from 'rxjs'
import { LocationGuard } from '../auth/decorators/russia.guard'

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('search/:name')
  async searchTracksByName(@Param('name') name: string) {
    const tracks = await this.userService.searchTracksByName(name);
    return tracks;
  }
  @Get('by-id/:id')
  async getUser(@Param('id') id:string){
    return this.userService.byId(+id)
  }

  @Get('profile')
  async getProfile(@CurrentUser('id') id:number){
    return this.userService.myProfile(id)
  }


  @Patch('subscribe/:channelId')
  async sub(@Param('channelId') channelId: number,  @Req() req: any){
    const token = req.headers['authorization'].split(' ')[1];
    return this.userService.subscribe(channelId, token)
  }

  @Get('subTracks')
  async subTracks(@Req() req: any){
    const token = req.headers['authorization'].split(' ')[1];
    return this.userService.getTrackSub(token)
  }

  @Get()
  getAllUsers() {
    return this.userService.getAll();
  }


  @Post('/role')
  @Roles('ADMIN') // Перевірка ролі "ADMIN" за допомогою декоратора @Roles
  @UseGuards(RolesGuard) // Використання RolesGuard для перевірки ролей
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }

  @Post('/ban')
  @Roles('ADMIN') // Перевірка ролі "ADMIN" за допомогою декоратора @Roles
  @UseGuards(RolesGuard) // Використання RolesGuard для перевірки ролей
  ban(@Body() dto: BanUserDto) {
    return this.userService.banUser(dto);
  }
  // @Get('chatGpt')
  // chatGpt(){
  //   const message = 'привіт '
  //   return this.userService.chatGpt(message)
  // }
}
