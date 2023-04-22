import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({})],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
