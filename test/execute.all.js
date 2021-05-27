jest.setTimeout(5000000);
import {platform} from 'process';
import {initialize} from '../src/Util';
import dictest from './dictionary';
import typetest from './type';
import exttest from './extension';
import proctest from './proc';
import datatest from './datacheck';
import khaiiitest from './khaiiiTest';
import utaggertest from './utaggerTest';

import {JVM} from '../src/jvm';

beforeAll(async () => {
    await initialize({
        packages: {OKT: 'LATEST', HNN: 'LATEST', ETRI: 'LATEST', KKMA: 'LATEST', KHAIII: 'LATEST', UTAGGER: 'LATEST'},
        javaOptions: ["-Xmx4g", "-Dfile.encoding=utf-8", "-Djna.library.path=" + process.env['KHAIII_LIB']]
    });
});

describe('JVM', () => {
    it('can check loadable packages', () => {
        expect(JVM.canLoadPackages({ARIRANG: 'LATEST'})).toEqual({ARIRANG: false});
        expect(JVM.canLoadPackages({OKT: 'LATEST'})).toEqual({OKT: true});
        expect(JVM.canLoadPackages({OKT: '3.0.0'})).toEqual({OKT: false});
    });
    it('only initialize once', () => {
        expect(() => JVM.init()).toThrowError();
        expect(() => JVM.init(null)).toThrowError();
        expect(() => JVM.init({})).toThrowError();
    });
});

dictest();
typetest();
exttest();
proctest();
datatest();

const platformType = platform()
if (platformType === 'linux' || platformType === 'darwin') khaiiitest();
if (platformType === 'win32') utaggertest();
