import { RouterService, HttpRoute } from '@centroidjs/web/router';
import {Router} from 'express';
import { HttpController } from './HttpController';
import { HttpResult } from './HttpResult';
import { HttpNextResult } from './HttpNextResult';
import { HttpControllerMethodAnnotation } from './HttpDecorators';
import capitalize from 'lodash/capitalize';
import { LangUtils } from '@themost/common';

declare type HttpControllerMethod = (...arg: unknown[]) => unknown;

export function controllerRouter(): Router {
    const router = Router();
    router.use((req, res, next) => {
        const routerService: RouterService = req.context.application.getService(RouterService);
        const route: HttpRoute = routerService.parseUrl(req.url);
        if (route) {
            const ControllerCtor = route.routeConfig.controller as new() => HttpController;
            const controller: HttpController = new ControllerCtor();
            controller.context = req.context;
            const action = (route.params.action || route.routeConfig.action) as string;
            let controllerMethod: HttpControllerMethod;
            const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(controller), action);
            if (descriptor && typeof descriptor.value === 'function') {
                controllerMethod = descriptor.value as HttpControllerMethod;
            }
            if (typeof controllerMethod === 'function') {
                // validate httpAction
                const annotation = controllerMethod as HttpControllerMethodAnnotation;
                // get full method name e.g. httpGet, httpPost, httpPut etc
                const method = `http${capitalize(req.method)}`;
                // if controller method has been annotated
                if (Object.prototype.hasOwnProperty.call(annotation, method)) {
                    const args: unknown[] = [];
                    // parse method arguments
                    const methodParams = LangUtils.getFunctionParams(controllerMethod);
                    methodParams.forEach((methodParam: string) => {
                        if (Object.prototype.hasOwnProperty.call(route.params, methodParam)) {
                            args.push(route.params[methodParam]);
                        } else {
                            args.push(undefined);
                        }
                    });
                    const result = controllerMethod.apply(controller, args);
                    if (result instanceof HttpNextResult) {
                        return next();
                    }
                    if (result instanceof HttpResult) {
                        return result.execute(controller.context).then(() => {
                            if (controller.context.response.writableEnded === false) {
                                controller.context.response.end();
                            }
                        }).catch((err) => {
                            return next(err);
                        });
                    }
                }
            }
        }
        return next();
    });
    return router;
}
