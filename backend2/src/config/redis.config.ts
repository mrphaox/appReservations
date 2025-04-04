import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = redisStore;
        console.log('\x1b[32m[Nest] 🚀 Redis cache initialized\x1b[0m');
        return {
          store,
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          ttl: 5000,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
