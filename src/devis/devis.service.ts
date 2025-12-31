import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Devis } from './schemas/devis.schema';

@Injectable()
export class DevisService {
  constructor(@InjectModel(Devis.name) private devisModel: Model<Devis>) {}

  async findAll(userId: string) {
    return this.devisModel.find({ userId }).populate('chantierId').exec();
  }

  async findOne(id: string, userId: string) {
    const devis = await this.devisModel
      .findOne({ _id: id, userId })
      .populate('chantierId')
      .exec();

    if (!devis) {
      throw new NotFoundException('Devis not found');
    }

    return devis;
  }

  async create(data: any, userId: string) {
    const newDevis = new this.devisModel({
      ...data,
      userId,
    });
    return newDevis.save();
  }

  async update(id: string, data: any, userId: string) {
    await this.findOne(id, userId);

    return this.devisModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.devisModel.findByIdAndDelete(id).exec();
  }
}
