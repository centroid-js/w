import {HttpApplication, HttpConsumer, HttpContext} from '@centroid.js/web/platform-server';
describe('HttpConsumer', () => {
    it('should create instance', async () => {
        const consumer = new HttpConsumer(function(value: any) {
            expect(this).toBeInstanceOf(HttpContext);
            return Promise.resolve(value);
        });
        const context = new HttpContext(new HttpApplication());
        const res = await consumer.run(context, true);
        expect(res).toBeTruthy();
    });
});
