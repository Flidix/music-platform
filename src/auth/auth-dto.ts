import { IsEmail, MinLength, IsString} from "class-validator"

export class AuthDto {
	@IsEmail()
	email:string
	@MinLength(6, {
		message: 'неменше 6 символів'
	})
	@IsString()
	password:string

	avatarPath: string

	@IsString()
	username: string
}