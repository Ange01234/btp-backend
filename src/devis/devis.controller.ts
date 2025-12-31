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
import { DevisService } from './devis.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateDevisDto } from './dto/update-devis.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Devis')
@ApiBearerAuth()
@Controller('devis')
@UseGuards(JwtAuthGuard)
export class DevisController {
  constructor(private devisService: DevisService) {}

  @Get()
  findAll(@GetUser() user: any) {
    return this.devisService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.devisService.findOne(id, user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new devis' })
  @ApiBody({ type: CreateDevisDto })
  @ApiResponse({
    status: 201,
    description: 'The devis has been successfully created.',
  })
  create(@Body() createDevisDto: CreateDevisDto, @GetUser() user: any) {
    return this.devisService.create(createDevisDto, user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing devis' })
  @ApiBody({ type: UpdateDevisDto })
  @ApiResponse({
    status: 200,
    description: 'The devis has been successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateDevisDto: UpdateDevisDto,
    @GetUser() user: any,
  ) {
    return this.devisService.update(id, updateDevisDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.devisService.remove(id, user.userId);
  }
}
