import { Module } from '@nestjs/common';
import { CpuService } from './cpu.service';
import { PowerModule } from 'src/power/power.module';

@Module({
  providers: [CpuService],
  imports: [PowerModule], // Step 1_2: PowerModule is imported so that its services can be injected in this module
  exports: [CpuService],
})
export class CpuModule {}
