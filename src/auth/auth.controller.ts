import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
	HttpCode,
	ValidationPipe,
	UseInterceptors, UploadedFiles, Req, UseGuards, Res
} from '@nestjs/common'
import { AuthService } from './auth.service';
import { AuthDto } from './auth-dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from './decorators/curentUser'
import { CreateTrackDto } from '../track/dto/create.track.dto'
import { JwtAuthGuard } from './decorators/auth.decorator'
import { defaultOptions } from 'class-transformer/types/constants/default-options.constant'
import { Response as ExpressResponse } from 'express';
import { LocationGuard } from './decorators/russia.guard'

@UseGuards(LocationGuard)
@Controller('auth')
export class AuthController {
		constructor(private readonly authService: AuthService) {}@Post('/logout')

	@Post('/logout')
	logout(@Res({ passthrough: true }) response: ExpressResponse) {
		response.clearCookie('accessToken');
		return true;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(
		@UploadedFiles() files: { avatarPath?: Express.Multer.File[]}, @Body() dto: AuthDto){
			return this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	@UseInterceptors(FileFieldsInterceptor([
		{ name: 'avatarPath', maxCount: 1 },
	]))
	async register(
		@UploadedFiles() files: { avatarPath?: Express.Multer.File[] },
		@Body() dto: AuthDto
	) {
		const { avatarPath } = files;
		return await this.authService.register(dto, avatarPath[0]);
	}

}
