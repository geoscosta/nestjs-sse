import { Controller, Get, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Get()
    all() {
        return this.reportsService.all();
    }

    @Post()
    request() {
        return this.reportsService.request();
    }
}
