import { Controller, Post, Body, Headers, Req, Logger } from "@nestjs/common";
import { Public } from "@/infra/auth/public";
import { Request } from "express";

@Controller("/debug")
@Public()
export class DebugRequestController {
  private readonly logger = new Logger(DebugRequestController.name);

  @Post("/request")
  async handle(
    @Body() body: any,
    @Headers() headers: any,
    @Req() request: Request
  ) {
    this.logger.log('=== DEBUG REQUEST ===');
    this.logger.log(`Headers: ${JSON.stringify(headers)}`);
    this.logger.log(`Body from @Body(): ${JSON.stringify(body)}`);
    this.logger.log(`Body from request.body: ${JSON.stringify(request.body)}`);
    this.logger.log(`Content-Type: ${headers['content-type']}`);
    this.logger.log('====================');

    return {
      success: true,
      receivedBody: body,
      bodyType: typeof body,
      bodyKeys: body ? Object.keys(body) : [],
      bodyIsEmpty: Object.keys(body || {}).length === 0,
      headers: {
        contentType: headers['content-type'],
        authorization: headers['authorization'] ? 'present' : 'missing',
        allHeaders: headers,
      },
      rawBody: request.body,
      method: request.method,
      url: request.url,
    };
  }
}

