import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chantier } from './schemas/chantier.schema';

@Injectable()
export class ChantiersService {
  constructor(
    @InjectModel(Chantier.name) private chantierModel: Model<Chantier>,
  ) {}

  async findAll(userId: string) {
    return this.chantierModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string) {
    const chantier = await this.chantierModel
      .findOne({ _id: id, userId })
      .exec();

    if (!chantier) {
      throw new NotFoundException('Chantier not found');
    }

    return chantier;
  }

  async create(data: any, userId: string) {
    const newChantier = new this.chantierModel({
      ...data,
      userId,
    });
    return newChantier.save();
  }

  async update(id: string, data: any, userId: string) {
    await this.findOne(id, userId); // Check existence and ownership

    return this.chantierModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Check existence and ownership

    return this.chantierModel.findByIdAndDelete(id).exec();
  }
}
