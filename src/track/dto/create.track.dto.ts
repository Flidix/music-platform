import { IsEmail, MinLength, IsString} from "class-validator"

export class CreateTrackDto {
	readonly name: string

	readonly description:string

	readonly picture: string

	readonly audio: string
}