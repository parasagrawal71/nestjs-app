import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class CpuService {
  // Step 1_3: Define powerService in constructor method where it is needed
  constructor(private powerService: PowerService) {}

  compute(a: number, b: number) {
    console.log(`Drawing 10 watts of power of Power Service`);
    this.powerService.supplyPower(10);
    return a + b;
  }
}
