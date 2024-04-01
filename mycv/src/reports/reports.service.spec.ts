import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  create: jest.fn((report) => report as Report),
  save: jest.fn((report) => report as Report),
}));

describe('ReportsService', () => {
  let service: ReportsService;
  let fakeReportsRepo: MockType<Repository<Report>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    fakeReportsRepo = module.get(getRepositoryToken(Report));

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create a report', async () => {
    const user = {
      id: 1,
      email: 'paras@gmail.com',
      password: 'secure-password',
    } as User;
    const report = await service.create(
      {
        price: 100,
        make: 'Honda',
        model: '',
        year: 2010,
        mileage: 20,
        lng: 1,
        lat: 1,
      },
      user,
    );

    expect(report).toBeDefined();
  });
});
