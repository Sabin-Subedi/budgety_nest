import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { USER_CREATED } from 'src/constant/events';
import { MailService } from 'src/mail/mail.service';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { generateOtpCode } from 'src/utils/default';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private tokenService: TokenService,
    @Inject(REQUEST) private readonly request: any,
    private mailService: MailService,
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  saltOrRounds = 10;

  async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid Email or Password');

    if (!user.password)
      throw new UnauthorizedException('Invalid Email or Password');

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
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.findUserByEmail(createUserDto.email);
    if (user)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const salt = await bcrypt.genSalt(this.saltOrRounds);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    const newUser = await this.userService.create(createUserDto);
    this.eventEmitter.emit(USER_CREATED, newUser);
    return newUser;
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
      const resetData = await this.prisma.resetToken.create({
        data: {
          userId: user.id,
          otp: generateOtpCode().toString(),
          expiry: new Date(Date.now() + 1000 * 60 * 60),
        },
      });

      if (!resetData)
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      await this.mailService.sendForgotPasswordEmail(email);

      return {
        message: 'Reset password link sent to your email',
      };
    } else {
      throw new HttpException('Email does not exist', HttpStatus.BAD_REQUEST);
    }
  }
}
