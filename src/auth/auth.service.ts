import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private tokenService: TokenService,
    @Inject(REQUEST) private readonly request: any,
    private mailService: MailService,
  ) {}

  saltOrRounds = 10;

  async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isPasswordCorrect = await new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    if (!isPasswordCorrect)
      throw new HttpException(
        'Invalid Email or Password',
        HttpStatus.UNAUTHORIZED,
      );

    return {
      ...(await this.tokenService.signTokenPair({
        sub: user.id,
        email: user.email,
      })),
      refresh_expiry: process.env.REFERESH_TOKEN_EXPIRY,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.findUserByEmail(createUserDto.email);
    if (user)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const salt = await bcrypt.genSalt(this.saltOrRounds);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    return this.userService.create(createUserDto);
  }

  async refreshToken(refreshToken: string) {
    try {
      const isBlackListed = await this.tokenService.checkIfTokenIsInBlacklist(
        refreshToken,
      );
      if (isBlackListed) throw new UnauthorizedException('Invalid Token');
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);
      const user = await this.userService.findOne(payload.sub);

      if (!user) throw new UnauthorizedException('Invalid Token');

      return {
        access_token: await this.tokenService.signAccessToken({
          sub: user.id,
          email: user.email,
        }),
      };
    } catch (err) {
      throw new UnauthorizedException(err?.message);
    }
  }

  async logout(refreshToken: string) {
    if (this.request.headers?.authorization) {
      const token = this.request.headers.authorization.split(' ')[1];
      await this.tokenService.setTokenInBlacklist(token);
    }
    return this.tokenService.setTokenInBlacklist(refreshToken);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      await this.mailService.sendForgotPasswordEmail(email);
    }
    return {
      message: 'If the email exists, you will receive an email shortly',
    };
  }
}
