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
  findAll(@GetUser() user: any) {
    return this.chantiersService.findAll(user.userId);
  }

  @Get(':id')
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
  @ApiOperation({ summary: 'Update an existing chantier' })
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
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.chantiersService.remove(id, user.userId);
  }
}
