import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,

    private jwt: JwtService,
  ) {}
  async signIn(email: string, password: string) {
    console.log(email);
    const user = await this.userservice.user({
      email,
    });
    const payload = {
      email: user?.email || 'anonymous',
      sub: user?.id || 1,
    };

    return {
      access_token: await this.jwt.signAsync(payload),
    };
  }

  async signUp(data: User) {
    const user = this.userservice.createUser(data);
    return user;
  }
}
