import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class ReportsService {

    constructor(
        private prismaService: PrismaService,
        @InjectQueue('reports')
        private reportsQueue: Queue,
    ) {}

    all() {
        return this.prismaService.report.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    findOne(id: number) {
        return this.prismaService.report.findUnique({
            where: {
                id,
            },
        });
    }

    async request() {
        const report = await this.prismaService.report.create({
            data: {
                status: Status.PENDENTE,
            },
        });
        await this.reportsQueue.add({ reportId: report.id });
        return report;
    }

    async produce(reportId: number) {
        console.log('produce method');
        await sleep(Math.random() * 10000);

        await this.prismaService.report.update({
            where: {
                id: reportId,
            },
            data: {
                status: Status.PROCESSANDO,
            },
        });

        await sleep(Math.random() * 10000);
        const randomStatus = Math.random() > 0.5 ? Status.CONCLUIDO : Status.ERROR;
        await this.prismaService.report.update({
            where: {
                id: reportId,
            },
            data: {
                filename: randomStatus === Status.CONCLUIDO ? `report-${reportId}.pdf` : null,
                status: randomStatus,
            },
        });
    }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
