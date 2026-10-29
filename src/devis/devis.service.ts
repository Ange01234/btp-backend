import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Devis } from './schemas/devis.schema';
import { Chantier } from '../chantiers/schemas/chantier.schema';

@Injectable()
export class DevisService {
  constructor(
    @InjectModel(Devis.name) private devisModel: Model<Devis>,
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

    return this.devisModel
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
    const devis = await this.devisModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .populate('chantierId')
      .exec();

    if (!devis) {
      throw new NotFoundException('Devis not found');
    }

    const chantier = await this.chantierModel.findOne({
      _id: devis.chantierId,
      isDeleted: { $ne: true },
      $or: [{ userId }, { 'spectators.userId': userId }],
    });

    if (!chantier && devis.userId.toString() !== userId.toString()) {
      throw new NotFoundException('Devis not found');
    }

    return devis;
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
        'Accès refusé : les spectateurs ne peuvent pas créer de devis sur ce chantier',
      );
    }

    const newDevis = new this.devisModel({
      ...data,
      userId,
    });
    return newDevis.save();
  }

  async update(id: string, data: any, userId: string) {
    const devis = await this.devisModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!devis) {
      throw new NotFoundException('Devis not found');
    }

    const chantier = await this.chantierModel.findOne({
      _id: devis.chantierId,
      isDeleted: { $ne: true },
    });

    if (!chantier || chantier.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'Accès refusé : seul le propriétaire peut modifier ce devis',
      );
    }

    return this.devisModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    const devis = await this.devisModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!devis) {
      throw new NotFoundException('Devis not found');
    }

    const chantier = await this.chantierModel.findOne({
      _id: devis.chantierId,
      isDeleted: { $ne: true },
    });

    if (!chantier || chantier.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'Accès refusé : seul le propriétaire peut supprimer ce devis',
      );
    }

    return this.devisModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }
}
