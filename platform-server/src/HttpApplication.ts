// MOST Web Framework Codename ZeroGravity, copyright 2017-2020 THEMOST LP all rights reserved
import { ConfigurationBase, SequentialEventEmitter, Args } from '@themost/common';
import {HttpApplicationBase, ApplicationServiceConstructor, HttpContextBase, RouterService} from '@centroidjs/web/core';
import { Application, Request, Response } from 'express-serve-static-core';
import { NextFunction } from 'connect';
import { HttpContext } from './HttpContext';
import { HttpController } from './HttpController';
import { HttpControllerAnnotation } from './HttpDecorators';

export class HttpApplication extends SequentialEventEmitter implements HttpApplicationBase {
    private readonly _configuration: ConfigurationBase;
    private services: Map<string, any> = new Map();
    private controllers: Map<string, any> = new Map();
    public container: any;

    constructor() {
        super();
        this._configuration = new ConfigurationBase();
        // use router service
        this.useService(RouterService);
    }

    /**
     * Gets application configuration
     */
    public get configuration(): ConfigurationBase {
        return this._configuration
    }

    /**
     * Registers an application service of the given type by defining an alternate type as constructor of the given service.
     * Use this operation to extend or override application service functionality.
     * @param serviceCtor
     * @param strategyCtor
     */
    useStrategy(serviceCtor: ApplicationServiceConstructor<any>, strategyCtor: ApplicationServiceConstructor<any>): this {
        Args.notNull(serviceCtor, 'Service constructor');
        Args.notNull(strategyCtor, 'Strategy constructor');
        const Strategy = strategyCtor as any;
        this.services.set(serviceCtor.name, new Strategy(this));
        return this;
    }

    /**
     * Registers an application service
     * @param serviceCtor An application service to register
     */
    useService(serviceCtor: ApplicationServiceConstructor<any>): this {
        Args.notNull(serviceCtor, 'Service constructor');
        const Service = serviceCtor as any;
        this.services.set(serviceCtor.name, new Service());
        return this;
    }

    /**
     * Returns true if the current application has a service of the given type
     * @param serviceCtor An application service to search for
     */
    hasService(serviceCtor: ApplicationServiceConstructor<any>): boolean {
        Args.notNull(serviceCtor, 'Service constructor');
        return this.services.has(serviceCtor.name);
    }

    /**
     * Gets an application service of the given type
     * @param serviceCtor The type of service to get
     */
    getService<T>(serviceCtor: ApplicationServiceConstructor<T>): T {
        Args.notNull(serviceCtor, 'Service constructor');
        return this.services.get(serviceCtor.name);
    }

    /**
     * Gets application configuration
     */
    getConfiguration(): ConfigurationBase {
        return this._configuration;
    }

    createContext(req: Request, res: Response) {
        const context = new HttpContext(this);
        context.request = req;
        context.response = res;
        return context;
    }

    middleware(app: Application) {
        // set container
        this.container = app;
        // return request handler
        return (req: Request, res: Response, next: NextFunction) => {
            // create context
            const context = this.createContext(req, res);
            // set context
            Object.defineProperty(req, 'context', {
                enumerable: false,
                configurable: false,
                writable: false,
                value: context
            });
            req.on('end', () => {
                //on end
                if (req.context) {
                    //finalize data context
                    return req.context.finalize(() => {
                    //
                    });
                }
            });
            return next();
        };
    }

    use(controllerConstructor: new() => HttpController) {
        const Controller = controllerConstructor as unknown;
        const annotation = Controller as HttpControllerAnnotation;
        this.controllers.set(annotation.name, controllerConstructor);
    }

}

declare global {
    namespace Express {
        interface Request {
            context: HttpContext;
        }
    }
}

