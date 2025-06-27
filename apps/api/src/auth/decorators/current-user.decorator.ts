import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Membership, User } from '@prisma';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export type CurrentUserType = User & {
  companyId: string;
  role: string;
  memberships: Membership[];
};
