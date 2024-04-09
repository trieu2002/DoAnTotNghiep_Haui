import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Role, RoleSchema } from 'src/roles/schema/role.schema';
import { Permission, PermissionSchema } from 'src/permissions/schema/permission.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService],
  imports: [MongooseModule.forFeature([
    {name: User.name, schema: UserSchema },
    {name:Role.name,schema:RoleSchema},
    {name:Permission.name,schema:PermissionSchema}
  ]),UsersModule],
})
export class DatabasesModule {}
