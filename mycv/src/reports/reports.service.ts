import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDTO } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportData: CreateReportDTO, user: User) {
    const report = await this.repo.create(reportData);
    report.user = user;

    return this.repo.save(report);
  }

  get() {
    return this.repo.find({ loadRelationIds: true });
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    Object.assign(report, { approved });
    return this.repo.save(report);
  }

  async createEstimate(estimateDto: GetEstimateDto) {
    const { make, model, lng, lat, year, mileage } = estimateDto || {};
    return (
      this.repo
        .createQueryBuilder()
        // .select('*') // NOTE: Not required in case of AVG(price)
        .select('AVG(price)', 'price')
        .where('make = :make', { make: estimateDto.make })
        .andWhere('model = :model', { model }) // IMPORTANT: Use 'andWhere' instead of 'where' to avoid overriding the first where
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        .andWhere('approved IS TRUE')
        // .orderBy('mileage - :mileage', { mileage }) // IMPORTANT: orderBy doesn't take a second argument
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .setParameters({ mileage })
        .limit(3)
        // .getRawMany() // NOTE: Not required in case of AVG(price)
        .getRawOne()
    );
  }
}
