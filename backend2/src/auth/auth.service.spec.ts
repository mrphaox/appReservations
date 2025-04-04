import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = { 
    findOne: jest.fn().mockResolvedValue({ userId: '1', username: 'test', password: 'hashedpassword' })
  };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Debe retornar un token cuando se autentica correctamente', async () => {
    const result = await service.login({ username: 'test', password: 'password' });
    expect(result.access_token).toBe('mockToken');
  });
});
