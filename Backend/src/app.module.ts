import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_NAME'),
        connectionFactory: (connection) => {
          connection.plugin(require('soft-delete-plugin-mongoose'));
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
     isGlobal:true
    }),
    UsersModule,
    AuthModule,
    CompaniesModule
],
  controllers: [],
  providers: [], 
})
export class AppModule {}
