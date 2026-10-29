import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { Chantier } from '../chantiers/schemas/chantier.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
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

    return this.paymentModel
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
    const payment = await this.paymentModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .populate('chantierId')
      .exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const chantier = await this.chantierModel.findOne({
      _id: payment.chantierId,
      isDeleted: { $ne: true },
      $or: [{ userId }, { 'spectators.userId': userId }],
    });

    if (!chantier && payment.userId.toString() !== userId.toString()) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
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
        'Accès refusé : les spectateurs ne peuvent pas enregistrer de paiements sur ce chantier',
      );
    }

    const newPayment = new this.paymentModel({
      ...data,
      userId,
    });
    return newPayment.save();
  }

  async update(id: string, data: any, userId: string) {
    const payment = await this.paymentModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const chantier = await this.chantierModel.findOne({
      _id: payment.chantierId,
      isDeleted: { $ne: true },
    });

    if (!chantier || chantier.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'Accès refusé : seul le propriétaire peut modifier ce paiement',
      );
    }

    return this.paymentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    const payment = await this.paymentModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const chantier = await this.chantierModel.findOne({
      _id: payment.chantierId,
      isDeleted: { $ne: true },
    });

    if (!chantier || chantier.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'Accès refusé : seul le propriétaire peut supprimer ce paiement',
      );
    }

    return this.paymentModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }
}
