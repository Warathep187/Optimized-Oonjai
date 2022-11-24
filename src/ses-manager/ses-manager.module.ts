import { Module } from '@nestjs/common';
import { SesManagerService } from './ses-manager.service';

@Module({
  providers: [SesManagerService],
  exports: [SesManagerService]
})
export class SesManagerModule {}
