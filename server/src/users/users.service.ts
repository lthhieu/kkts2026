import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
import { LoginBySocial } from 'src/auth/auth.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  isValidPassword(pass: string, hash: string) {
    return compareSync(pass, hash)
  }

  hashPassword = (plainText: string) => {
    let salt = genSaltSync(10);
    let hash = hashSync(plainText, salt);
    return hash
  }
  async findOneByUsername(email: string) {
    return await this.userModel.findOne({ email })
  }
  async create(createUserDto: CreateUserDto) {
    let checkEmail = await this.findOneByUsername(createUserDto.email)
    if (checkEmail) {
      throw new BadRequestException('Email đã tồn tại!')
    }
    let hash = this.hashPassword(createUserDto.password)
    return await this.userModel.create({
      ...createUserDto, password: hash
    })
  }

  async createByGoogle(loginBySocial: LoginBySocial) {
    const { email, name } = loginBySocial
    let isExist = await this.findOneByUsername(email)
    if (isExist) return isExist
    let newUser = await this.userModel.create({
      email, name, role: 'guest'
    })
    return newUser;
  }

  async createMany(createUserDto: CreateUserDto[]) {
    // 1. Loại bỏ các bản ghi trùng lặp ngay trong chính file Excel/Mảng đầu vào (nếu có)
    const uniqueInput = Array.from(new Map(createUserDto.map(item => [item.email, item])).values());

    // 2. Lấy danh sách tất cả email từ mảng đã lọc
    const emails = uniqueInput.map(u => u.email);

    // 3. Tìm các email đã tồn tại trong Database
    const existingUsers = await this.userModel.find(
      { email: { $in: emails } },
      { email: 1 } // Chỉ lấy field email để tối ưu tốc độ
    ).lean();

    const existingEmails = existingUsers.map(u => u.email);

    // 4. Lọc ra những user chưa tồn tại trong DB
    const dataFilter = uniqueInput.filter(dto => !existingEmails.includes(dto.email));

    if (dataFilter.length === 0) {
      throw new BadRequestException('Không có tài khoản nào được thêm mới vì tất cả đều trùng email với dữ liệu hiện có!');
    }

    // 5. Hash password cho danh sách hợp lệ
    const payload = dataFilter.map((dto) => {
      return {
        ...dto,
        password: this.hashPassword(dto.password.toString())
      };
    });

    // 6. Insert hàng loạt
    return await this.userModel.insertMany(payload);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = (await this.userModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let users = await this.userModel.find(filter)
      .select('-password')
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'unit', select: 'name' })
      .exec()
    return {
      meta: {
        current: defaultCurrent, //trang hiện tại
        pageSize: defaultLimit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result: users
    }
  }

  async findOne(id: string) {
    return await this.userModel.findOne({ _id: id }).select('-password')
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto?.password) {
      let hash = this.hashPassword(updateUserDto.password)
      return await this.userModel.updateOne({ _id: id },
        { ...updateUserDto, password: hash }
      )
    } else {
      return await this.userModel.updateOne({ _id: id }, updateUserDto)
    }
  }

  async remove(id: string, user: IUser) {
    const exist = await this.findOne(id)
    if (user.email === exist?.email) {
      throw new BadRequestException('Bạn không thể xóa chính mình!')
    }
    return await this.userModel.deleteOne({ _id: id })
  }

  updateRefreshToken = async (refreshToken: string | null, _id: string) => {
    return await this.userModel.updateOne({ _id }, {
      refreshToken
    })
  }

  async findOneByToken(refreshToken: string) {
    return await this.userModel.findOne({ refreshToken })
  }
  async removeMany(ids: any[]) {
    return await this.userModel.deleteMany({ _id: { $in: ids } });
  }
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    // 1. Tìm user
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('Người dùng không tồn tại');

    // 2. Kiểm tra mật khẩu cũ
    const isMatch = this.isValidPassword(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    // 3. Hash mật khẩu mới và lưu
    const hashedNewPassword = this.hashPassword(newPassword);
    return await this.userModel.updateOne(
      { _id: id },
      { password: hashedNewPassword }
    );

  }
}
