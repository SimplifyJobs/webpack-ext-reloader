import { install } from 'source-map-support';
import { DEBUG, ERROR } from './constants/log.constants';
import ExtensionReloaderImpl from './ExtensionReloader';
import { setLogLevel } from './utils/logger';

install();
setLogLevel(process.env.NODE_ENV === 'production' ? ERROR : DEBUG);

export = ExtensionReloaderImpl;
