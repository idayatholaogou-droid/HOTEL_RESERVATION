import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // ✅ CORS
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    // ✅ Servir le dossier uploads en statique
    // Accessible via http://localhost:3000/uploads/<nom-fichier>
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
        prefix: '/uploads/',
    });
    await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
