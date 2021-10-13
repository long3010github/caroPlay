import { Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { UserRegisterDTO } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from 'src/schemas/refreshToken.schema';
import { CreateRefreshTokenDTO } from './dto/refreshToken.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  public async createUser(userRegistrationData: UserRegisterDTO) {
    const { username, password } = userRegistrationData;
    const isExist = await this.userModel.findOne({
      username: username,
    });
    if (isExist)
      throw new HttpException(
        'User with that username already exists',
        HttpStatus.CONFLICT,
      );
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(this.configService.get<string>('bcrypt_salt'), 10),
    );
    const user = await this.userModel.create({
      ...userRegistrationData,
      password: hashedPassword,
    });
    return user;
  }

  public async getUserWithCredential(
    username: string,
    plainTextPassword: string,
  ) {
    const user = await this.userModel.findOne({ username });
    if (!user)
      throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED);
    await this.verifyPassword(plainTextPassword, user.password);
    return user;
  }

  public async getUserWithId(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isMatch)
      throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED);
  }
}
