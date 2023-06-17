import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import fetch from 'node-fetch';

@Injectable()
export class LocationGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		try {
			const response = await fetch('http://ip-api.com/json/?fields=61439');
			const data = await response.json();

			if (data.country === 'Russia' || data.country === 'russia') {
				throw new HttpException('москальм вхід заборонений', HttpStatus.BAD_REQUEST);
			}

			return true;
		} catch (error) {
			throw new HttpException('Помилка отримання місцезнаходження', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
