import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  getUsers() {
    return this.databaseService.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
  }
}
