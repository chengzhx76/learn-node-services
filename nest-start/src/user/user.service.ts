import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createCatDto: CreateUserDto): Promise<User> {
    console.log('createCatDto', createCatDto);
    const createdCat = await this.userModel.create(createCatDto);
    return createdCat;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const deletedCat = await this.userModel
      .findByIdAndDelete({ _id: id })
      .exec();
    return deletedCat;
  }

  async testPromise(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id === '1') {
          reject('error-reject');
        } else {
          resolve('resolve' + id);
        }
      }, 1000);
    });
  }

  /*  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  } */
}
