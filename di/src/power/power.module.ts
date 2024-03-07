import { Module } from '@nestjs/common';
import { PowerService } from './power.service';

@Module({
  providers: [PowerService], // This PowerService is injected within this module only (i.e., private)
  exports: [PowerService], // Step 1_1: This PowerService is exported so that it can be injected in other modules
})
export class PowerModule {}
