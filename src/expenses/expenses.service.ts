import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from './schemas/expense.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) {}

  async findAll(userId: string) {
    return this.expenseModel.find({ userId }).populate('chantierId').exec();
  }

  async findOne(id: string, userId: string) {
    const expense = await this.expenseModel
      .findOne({ _id: id, userId })
      .populate('chantierId')
      .exec();

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async create(data: any, userId: string) {
    const newExpense = new this.expenseModel({
      ...data,
      userId,
    });
    return newExpense.save();
  }

  async update(id: string, data: any, userId: string) {
    await this.findOne(id, userId);

    return this.expenseModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.expenseModel.findByIdAndDelete(id).exec();
  }
}
