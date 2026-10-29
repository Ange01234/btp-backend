import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from './schemas/expense.schema';
import { Chantier } from '../chantiers/schemas/chantier.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(Chantier.name) private chantierModel: Model<Chantier>,
  ) {}

  async findAll(userId: string) {
    const accessibleChantiers = await this.chantierModel
      .find({
        isDeleted: { $ne: true },
        $or: [{ userId }, { 'spectators.userId': userId }],
      })
      .select('_id')
      .exec();

    const accessibleChantierIds = accessibleChantiers.map((c) => c._id.toString());

    return this.expenseModel
      .find({
        isDeleted: { $ne: true },
        $or: [
          { userId },
          { chantierId: { $in: accessibleChantierIds as any } },
        ],
      })
      .populate('chantierId')
      .exec();
  }

  async findOne(id: string, userId: string) {
    const expense = await this.expenseModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .populate('chantierId')
      .exec();

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    const chantier = await this.chantierModel.findOne({
      _id: expense.chantierId,
      isDeleted: { $ne: true },
      $or: [{ userId }, { 'spectators.userId': userId }],
    });

    if (!chantier && expense.userId.toString() !== userId.toString()) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async create(data: any, userId: string) {
    const chantier = await this.chantierModel.findOne({
      _id: data.chantierId,
      isDeleted: { $ne: true },
    });

    if (!chantier) {
      throw new NotFoundException('Chantier non trouvé');
    }

    if (chantier.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'Accès refusé : les spectateurs ne peuvent pas ajouter de dépenses sur ce chantier',
      );
    }

    const newExpense = new this.expenseModel({
      ...data,
      userId,
    });
    return newExpense.save();
  }

  async update(id: string, data: any, userId: string) {
    const expense = await this.expenseModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    const chantier = await this.chantierModel.findOne({
      _id: expense.chantierId,
      isDeleted: { $ne: true },
    });

    if (!chantier || chantier.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'Accès refusé : seul le propriétaire peut modifier cette dépense',
      );
    }

    return this.expenseModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    const expense = await this.expenseModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    const chantier = await this.chantierModel.findOne({
      _id: expense.chantierId,
      isDeleted: { $ne: true },
    });

    if (!chantier || chantier.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'Accès refusé : seul le propriétaire peut supprimer cette dépense',
      );
    }

    return this.expenseModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }
}
