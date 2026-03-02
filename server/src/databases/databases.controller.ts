import { Controller, Get } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('databases')
export class DatabasesController {
  constructor(private readonly databasesService: DatabasesService) { }

  @Get('get-data')
  @ResponseMessage('Lấy dữ liệu thành công')
  create() {
    return this.databasesService.getData();
  }
}
