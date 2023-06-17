import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from '../user/user.entity'
import { RoleEntity } from './roles entity'
import { UserRolesEntity } from './user-roles.entity'

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports:[TypeOrmModule.forFeature([RoleEntity, UserEntity, UserRolesEntity]),
  ],
  exports:[RolesService]
})
export class RolesModule {}
