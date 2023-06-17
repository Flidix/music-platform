import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

export const getTypeOrmConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: "postgres",
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database: '',
    autoLoadEntities: true,
    synchronize: true
})