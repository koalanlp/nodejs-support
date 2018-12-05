jest.setTimeout(1000000);
import {initialize} from '../src/Util';
import dictest from './dictionary';
import typetest from './type';
import exttest from './extension';
import proctest from './proc';

beforeAll(async () => {
    await initialize({packages: {OKT: 'LATEST', HNN: 'LATEST', ETRI: 'LATEST', KKMA: 'LATEST'}});
});

dictest();
typetest();
exttest();
proctest();
