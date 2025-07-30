import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.OWNER, Role.ADMIN)
  @Get()
  findAllInCompany() {
    // En un futuro, podrías añadir paginación aquí
    // return this.usersService.findAllInCompany(user.companyId);
    return 'Endpoint para listar usuarios de la empresa';
  }
}
