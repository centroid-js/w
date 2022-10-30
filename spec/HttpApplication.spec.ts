// MOST Web Framework Codename ZeroGravity, copyright 2017-2020 THEMOST LP all rights reserved
import {HttpApplication} from '@centroid.js/w/platform-server';
import { ApplicationService, ApplicationBase } from '@themost/common';

class SampleService extends ApplicationService {
    constructor(app: ApplicationBase) {
        super(app);
    }

    getMessage() {
        return 'Hello World';
    }
}

class SampleStrategy extends SampleService {
    constructor(app: ApplicationBase) {
        super(app);
    }

    getMessage() {
        return 'Hello World!';
    }
}

describe('HttpApplication', () => {

    it('should create instance', () => {
        const app = new HttpApplication();
        expect(app).toBeTruthy()
    });

    it('should use HttpApplication.hasService()', () => {
        const app = new HttpApplication();
        expect(app.hasService(SampleService)).toBeFalsy();
        expect(() => {
            app.hasService(null);
        }).toThrowError();
    });

    it('should use HttpApplication.useService()', () => {
        const app = new HttpApplication();
        app.useService(SampleService);
        expect(app.hasService(SampleService)).toBeTruthy();
    });

    it('should use HttpApplication.getService()', () => {
        const app = new HttpApplication();
        app.useService(SampleService);
        const service = app.getService(SampleService);
        expect(service).toBeTruthy();
        expect(service.getMessage()).toEqual('Hello World');
    });

    it('should use HttpApplication.useStrategy()', () => {
        const app = new HttpApplication();
        app.useStrategy(SampleService, SampleStrategy);
        expect(app.hasService(SampleService)).toBeTruthy();
        const service = app.getService(SampleService);
        expect(service).toBeInstanceOf(SampleStrategy);
        expect(service.getMessage()).toEqual('Hello World!');
    });

    it('should use HttpApplication.getConfiguration()', () => {
        const app = new HttpApplication();
        expect(app.configuration).toBeTruthy();
        expect(app.getConfiguration()).toBeTruthy();
    });

});
