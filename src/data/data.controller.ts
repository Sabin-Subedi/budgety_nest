import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DataService } from './data.service';
import { CompositeRequestDto } from './dto/composite-request';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createDatumDto: CompositeRequestDto) {
    return this.dataService.findAllData(createDatumDto);
  }
}
