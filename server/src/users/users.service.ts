import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

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
}
