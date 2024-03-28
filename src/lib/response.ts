import { ParameterizedContext } from 'koa';

import * as logger from 'lib/logger';

export function verify(checks: any[], status: number, type: string, code: string = '', message: string = '') {
    for (const check of checks) {
        if (!check) {
            throw {
                status,
                type,
                code,
                message,
            };
        }
    }
}

export function success(ctx: ParameterizedContext, body: any = null) {
    ctx.status = 200;

    if (body === null) {
        ctx.body = JSON.stringify(body);
    } else {
        ctx.body = body;
    }
}

export function error(
    ctx: ParameterizedContext,
    status: number,
    type: string,
    code: string = '',
    message: string = ''
): void {
    logger.error({ type, message, code });

    ctx.status = status || 501;

    const body: { type: string; message: string | undefined; code: string | undefined } = {
        type,
        message: undefined,
        code: undefined,
    };

    if (message) {
        body.message = message;
    }

    if (code) {
        body.code = code;
    }

    ctx.body = body;
}

export function redirect(ctx: ParameterizedContext, redirectUrl: string) {
    ctx.redirect(redirectUrl);
}
