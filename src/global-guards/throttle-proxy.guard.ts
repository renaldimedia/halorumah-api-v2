import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ThrottlerProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    console.log(req)
    return req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction to meet your own needs
  }

  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.res };
  }
}