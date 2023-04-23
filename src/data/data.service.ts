import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from '@types';
import { firstValueFrom } from 'rxjs';
import { CompositeRequestDto } from './dto/composite-request';

@Injectable()
export class DataService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(REQUEST) private request: Request,
  ) {}
  async findAllData(compositeRequestDto: CompositeRequestDto) {
    const subRequestArray = compositeRequestDto.compositeRequest.map(
      (request) => this.requestData(request),
    );

    try {
      const responses = await Promise.all(subRequestArray);

      return responses.reduce((acc, curr: any) => {
        curr?.referenceId && (acc[curr.referenceId] = curr);
        delete curr.referenceId;
        return acc;
      }, {});
    } catch (err) {
      console.log(err);
    }
  }

  requestData(request) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.request.headers.authorization || '',
      ...((typeof request.headers === 'object' && request.headers) || {}),
    };
    return new Promise(async (resolve, reject) => {
      try {
        const data = await firstValueFrom(
          this.httpService.request({
            method: request.method,
            url: 'http://192.168.1.69:3000' + request.url,
            headers,
          }),
        );

        resolve({
          referenceId: request.refrenceId,
          status: data?.status || 200,
          message: data?.statusText || 'OK',
          data: data?.data,
        });
      } catch (err) {
        console.log(err);
        resolve({
          referenceId: request.refrenceId,
          ...(err.response.data
            ? err.response.data
            : {
                status: err?.response?.status || 500,
                message:
                  err?.response?.message ||
                  err?.response?.statusText ||
                  'Internal Server Error',
              }),
        });
      }
    });
  }
}
