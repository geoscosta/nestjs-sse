import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    
    //Inicializa a conexão com o banco de dados
    async onModuleInit() {
        await this.$connect();
    }

    //toda vez que a conexão for fechada será destruída qualquer instância do prisma que esteja aberta.
    async enableShutdownHooks(app: any) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }

}
