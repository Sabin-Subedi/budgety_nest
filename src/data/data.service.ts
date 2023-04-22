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

    const responses = await Promise.all(subRequestArray);

    return responses.reduce((acc, curr: any) => {
      curr?.referenceId && (acc[curr.referenceId] = curr);
      delete curr.referenceId;
      return acc;
    }, {});
  }

  requestData(request) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.request.headers,
      ...((typeof request.headers === 'object' && request.headers) || {}),
    };
    return new Promise(async (resolve, reject) => {
      console.log('request', request);
      const data = await firstValueFrom(
        this.httpService.request({
          method: request.method,
          url: 'http://jsonplaceholder.typicode.com/posts/1',
        }),
      );
      console.log('data', request);

      resolve({
        referenceId: request.refrenceId,
        status: data.status || 200,
        message: data.statusText || 'OK',
        data: data.data,
      });
    });
  }
}
