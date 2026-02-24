import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INIT_UNITS } from 'src/databases/sample';
import { Unit } from 'src/units/schemas/unit.schema';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name);
    constructor(@InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Unit.name) private unitModel: Model<Unit>,
        private usersService: UsersService,
        private configService: ConfigService) { }
    async onModuleInit() {
        const isInit = this.configService.get<string>("SHOULD_INIT")
        if (Boolean(isInit)) {
            const countUser = await this.userModel.countDocuments({})
            const countUnit = await this.unitModel.countDocuments({})

            //create units
            if (countUnit === 0) {
                await this.unitModel.insertMany(INIT_UNITS);
            }

            // create users
            if (countUser === 0) {
                await this.userModel.insertMany([
                    {
                        name: "Super admin",
                        email: "sa@vlute.edu.vn",
                        password: this.usersService.hashPassword(this.configService.get<string>("INIT_PASSWORD") || "123456"),
                        role: 'superadmin',
                        unit: "69707c5eca8fa40cbe19ec9b"
                    },
                    {
                        name: "Admin",
                        email: "admin@vlute.edu.vn",
                        password: this.usersService.hashPassword(this.configService.get<string>("INIT_PASSWORD") || "123456"),
                        role: 'admin',
                        unit: "69707c5eca8fa40cbe19ec9b"
                    },
                    {
                        name: "Thủ kho",
                        email: "thukho@vlute.edu.vn",
                        password: this.usersService.hashPassword(this.configService.get<string>("INIT_PASSWORD") || "123456"),
                        role: 'thukho',
                        unit: "69707c5eca8fa40cbe19ec9b"
                    },
                    {
                        name: "Trưởng đơn vị",
                        email: "truongdv@vlute.edu.vn",
                        password: this.usersService.hashPassword(this.configService.get<string>("INIT_PASSWORD") || "123456"),
                        role: 'truongdv',
                        unit: "69707c5eca8fa40cbe19ec9b"
                    },
                    {
                        name: "Giáo viên",
                        email: "gvcntt@vlute.edu.vn",
                        password: this.usersService.hashPassword(this.configService.get<string>("INIT_PASSWORD") || "123456"),
                        role: 'gv',
                        unit: "69707d1bca8fa40cbe19ecad"
                    },
                ])
            }

            if (countUser > 0 && countUnit > 0) {
                this.logger.log('Already initial sample data');
            }
        }
    }
}
