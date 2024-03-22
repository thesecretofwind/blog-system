import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { UploadService } from './upload/upload.service';
import { UploadController } from './upload/upload.controller';

import databaseConfig from './config/database.config';
// import { MulterModule } from '@nestjs/platform-express';
// import path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('databaseConfig'),
    }),

    // MulterModule.registerAsync({
    //   useFactory() {
    //     return {
    //       storage: {
    //         destination: 'public',
    //         filename: (req, file, cb) => {
    //           cb(null, Date.now() + path.extname(file.originalname));
    //         },
    //       }
    //     }
    //   }
    // })
    // UserModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, UploadService],
})
export class AppModule {}
