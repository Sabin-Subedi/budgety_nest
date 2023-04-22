import { Body, Controller, Post } from '@nestjs/common';
import { DataService } from './data.service';
import { CompositeRequestDto } from './dto/composite-request';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post()
  create(@Body() createDatumDto: CompositeRequestDto) {
    return this.dataService.findAllData(createDatumDto);
  }
}
