import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { ChantiersService } from './chantiers.service';
import { CreateChantierDto } from './dto/create-chantier.dto';
import { UpdateChantierDto } from './dto/update-chantier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Chantiers')
@ApiBearerAuth()
@Controller('chantiers')
@UseGuards(JwtAuthGuard)
export class ChantiersController {
  constructor(private chantiersService: ChantiersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all chantiers accessible by user (owned or shared as spectator)' })
  findAll(@GetUser() user: any) {
    return this.chantiersService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chantier by id' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.chantiersService.findOne(id, user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new chantier' })
  @ApiBody({ type: CreateChantierDto })
  @ApiResponse({
    status: 201,
    description: 'The chantier has been successfully created.',
  })
  create(@Body() createChantierDto: CreateChantierDto, @GetUser() user: any) {
    return this.chantiersService.create(createChantierDto, user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing chantier (Owner only)' })
  @ApiBody({ type: UpdateChantierDto })
  @ApiResponse({
    status: 200,
    description: 'The chantier has been successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateChantierDto: UpdateChantierDto,
    @GetUser() user: any,
  ) {
    return this.chantiersService.update(id, updateChantierDto, user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chantier (Owner only)' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.chantiersService.remove(id, user.userId);
  }

  @Post(':id/spectators')
  @ApiOperation({ summary: 'Add a spectator to a chantier (Owner only)' })
  addSpectator(
    @Param('id') id: string,
    @Body('userId') spectatorUserId: string,
    @GetUser() user: any,
  ) {
    return this.chantiersService.addSpectator(id, spectatorUserId, user.userId);
  }

  @Delete(':id/spectators/:spectatorId')
  @ApiOperation({ summary: 'Remove a spectator from a chantier (Owner only)' })
  removeSpectator(
    @Param('id') id: string,
    @Param('spectatorId') spectatorId: string,
    @GetUser() user: any,
  ) {
    return this.chantiersService.removeSpectator(id, spectatorId, user.userId);
  }
}
