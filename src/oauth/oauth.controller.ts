import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Public } from '@permissions';
import { OAuthGuard } from './guards/oauth.guard';
import { OauthService } from './oauth.service';

@Public()
@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('google')
  @UseGuards(OAuthGuard('google'))
  async google(@Req() req) {
    try {
      return req.user;
    } catch (err) {
      console.log(err);
    }
  }

  @Get('facebook')
  @UseGuards(OAuthGuard('facebook'))
  async facebook(@Req() req) {
    try {
      return req.user;
    } catch (err) {
      console.log(err);
    }
  }
}
