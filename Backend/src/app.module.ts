import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
     isGlobal:true
  }),
    UsersModule,
    AuthModule
],
  controllers: [],
  providers: [], 
})
export class AppModule {}
