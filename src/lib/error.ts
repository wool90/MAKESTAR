export function errorHandler(callback: (ctx, status: number, type: string, code?: string, message?: string) => void) {
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            callback(ctx, err.status, err.type, err.code, err.message);
        }
    };
}
