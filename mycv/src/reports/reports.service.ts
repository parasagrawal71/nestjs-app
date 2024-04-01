import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDTO } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportData: CreateReportDTO, user: User) {
    const report = await this.repo.create(reportData);
    report.user = user;

    return this.repo.save(report);
  }

  get() {
    return this.repo.find();
  }
}
