import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const existingUser = await this.userModel
      .findOne({ email: data.email })
      .exec();

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new this.userModel({
      ...data,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async login(data: any) {
    const user = await this.userModel.findOne({ email: data.email }).exec();

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive && user.name !== 'Modeste Hounnouvi') {
      throw new UnauthorizedException('Account is not activated. Please contact an administrator.');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        isActive: user.isActive,
        role: user.role,
      },
    };
  }

  async activateUser(userId: string) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.isActive = true;
    await user.save();

    return {
      message: 'User account activated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        isActive: user.isActive,
        role: user.role,
      },
    };
  }
}
