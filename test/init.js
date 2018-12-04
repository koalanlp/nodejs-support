import {initialize} from '../src/Util';

beforeAll(async() => {
    await initialize({packages: {OKT: 'LATEST', HNN: 'LATEST', ETRI: 'LATEST', KKMA: 'LATEST'}});
});
