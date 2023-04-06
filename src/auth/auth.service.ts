import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { getTimeDifferenceInSeconds } from '@utils';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private tokenService: TokenService,
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

      await this.tokenService.setTokenInBlacklist(
        refreshToken,
        getTimeDifferenceInSeconds(payload.exp * 1000),
      );

      return this.tokenService.signTokenPair({
        sub: user.id,
        email: user.email,
        iat: payload.iat,
      });
    } catch (err) {
      throw new UnauthorizedException(err?.message);
    }
  }
}