import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('Status')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check database health' })
  getHealth() {
    const states = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
      99: 'Uninitialized',
    };

    const readyState = this.connection.readyState;
    const isHealthy = readyState === 1;

    return {
      status: isHealthy ? 'up' : 'down',
      database: {
        readyState,
        status: states[readyState] || 'Unknown',
        name: this.connection.name,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
