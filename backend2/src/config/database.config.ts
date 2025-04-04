import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const DatabaseModule = MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const mongoUri = configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/test2'); 
    console.log(`\x1b[32m[Nest] 🚀 Connecting to MongoDB...\x1b[0m`);
    return { uri: mongoUri };
  },
});