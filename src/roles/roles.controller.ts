import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { RolesService } from './roles.service';
import { CreateRoleDto } from './createRole.dto'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Post()
  create(@Body() dto: CreateRoleDto){
    return this.rolesService.createRole(dto)
  }

  @Get('/:name')
  get(@Param('name') name: string){
    return this.rolesService.findOneByName(name)
  }

  @Post(':userId/add/:roleId')
  async addRoleToUser(@Param('userId') userId: number, @Param('roleId') roleId: number): Promise<void> {
    await this.rolesService.addRoleToUser(userId, roleId);
  }

  @Delete(':userId/remove/:roleId')
  async removeRoleFromUser(@Param('userId') userId: number, @Param('roleId') roleId: number): Promise<void> {
    await this.rolesService.removeRoleFromUser(userId, roleId);
  }
}
