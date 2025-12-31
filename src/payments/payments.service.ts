import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async findAll(userId: string) {
    return this.paymentModel.find({ userId }).populate('chantierId').exec();
  }

  async findOne(id: string, userId: string) {
    const payment = await this.paymentModel
      .findOne({ _id: id, userId })
      .populate('chantierId')
      .exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async create(data: any, userId: string) {
    const newPayment = new this.paymentModel({
      ...data,
      userId,
    });
    return newPayment.save();
  }

  async update(id: string, data: any, userId: string) {
    await this.findOne(id, userId);

    return this.paymentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.paymentModel.findByIdAndDelete(id).exec();
  }
}
