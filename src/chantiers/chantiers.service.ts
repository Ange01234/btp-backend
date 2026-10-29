import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chantier } from './schemas/chantier.schema';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class ChantiersService {
  constructor(
    @InjectModel(Chantier.name) private chantierModel: Model<Chantier>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll(userId: string) {
    return this.chantierModel
      .find({
        isDeleted: { $ne: true },
        $or: [{ userId }, { 'spectators.userId': userId }],
      })
      .populate('userId', 'name email company')
      .exec();
  }

  async findOne(id: string, userId: string) {
    const chantier = await this.chantierModel
      .findOne({
        _id: id,
        isDeleted: { $ne: true },
        $or: [{ userId }, { 'spectators.userId': userId }],
      })
      .populate('userId', 'name email company')
      .exec();

    if (!chantier) {
      throw new NotFoundException('Chantier not found');
    }

    return chantier;
  }

  async create(data: any, userId: string) {
    let spectators: any[] = [];
    if (data.spectatorIds && Array.isArray(data.spectatorIds) && data.spectatorIds.length > 0) {
      const users = await this.userModel
        .find({
          _id: { $in: data.spectatorIds },
          isActive: true,
        })
        .exec();
      spectators = users.map((u) => ({
        userId: u.id,
        email: u.email,
        name: u.name,
        company: u.company,
        addedAt: new Date(),
      }));
    }

    const newChantier = new this.chantierModel({
      ...data,
      userId,
      spectators,
    });
    const saved = await newChantier.save();
    return this.chantierModel
      .findById(saved._id)
      .populate('userId', 'name email company')
      .exec();
  }

  async update(id: string, data: any, userId: string) {
    const chantier = await this.chantierModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!chantier) {
      throw new NotFoundException('Chantier not found');
    }

    if (chantier.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('Seul le propriétaire peut modifier ce chantier');
    }

    if (data.spectatorIds && Array.isArray(data.spectatorIds)) {
      const users = await this.userModel
        .find({
          _id: { $in: data.spectatorIds },
          isActive: true,
        })
        .exec();
      data.spectators = users.map((u) => ({
        userId: u.id,
        email: u.email,
        name: u.name,
        company: u.company,
        addedAt: new Date(),
      }));
    }

    return this.chantierModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('userId', 'name email company')
      .exec();
  }

  async remove(id: string, userId: string) {
    const chantier = await this.chantierModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!chantier) {
      throw new NotFoundException('Chantier not found');
    }

    if (chantier.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('Seul le propriétaire peut supprimer ce chantier');
    }

    return this.chantierModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }

  async addSpectator(id: string, spectatorUserId: string, currentUserId: string) {
    const chantier = await this.chantierModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!chantier) {
      throw new NotFoundException('Chantier non trouvé');
    }

    if (chantier.userId.toString() !== currentUserId.toString()) {
      throw new ForbiddenException('Seul le propriétaire peut ajouter des spectateurs');
    }

    if (spectatorUserId.toString() === currentUserId.toString()) {
      throw new BadRequestException('Vous êtes déjà le propriétaire de ce chantier');
    }

    const alreadySpectator = chantier.spectators.some(
      (s) => s.userId.toString() === spectatorUserId.toString(),
    );
    if (alreadySpectator) {
      throw new ConflictException('Cet utilisateur est déjà spectateur sur ce chantier');
    }

    const user = await this.userModel.findById(spectatorUserId).exec();
    if (!user || !user.isActive) {
      throw new NotFoundException('Utilisateur introuvable ou inactif');
    }

    chantier.spectators.push({
      userId: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      addedAt: new Date(),
    });

    await chantier.save();
    return this.chantierModel
      .findById(id)
      .populate('userId', 'name email company')
      .exec();
  }

  async removeSpectator(id: string, spectatorUserId: string, currentUserId: string) {
    const chantier = await this.chantierModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!chantier) {
      throw new NotFoundException('Chantier non trouvé');
    }

    if (chantier.userId.toString() !== currentUserId.toString()) {
      throw new ForbiddenException('Seul le propriétaire peut retirer des spectateurs');
    }

    chantier.spectators = chantier.spectators.filter(
      (s) => s.userId.toString() !== spectatorUserId.toString(),
    );

    await chantier.save();
    return this.chantierModel
      .findById(id)
      .populate('userId', 'name email company')
      .exec();
  }
}
