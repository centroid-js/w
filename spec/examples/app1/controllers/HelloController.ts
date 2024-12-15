import { HttpController, httpController, httpGet } from '@centroidjs/web/platform-server';

@httpController('hello')
export class HelloController extends HttpController {
    
    @httpGet({
        name: 'index',
        params: [
            {
                name: 'message',
                maxLength: 512
            }
        ]
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    index(message: string) {
        return this.content('Hello World');
    }
}
