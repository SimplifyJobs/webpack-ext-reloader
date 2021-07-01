import { install } from "source-map-support";
import { DEBUG, ERROR, NONE } from "./constants/log.constants";
import ExtensionReloaderImpl from "./ExtensionReloader";
import { setLogLevel } from "./utils/logger";

install();

let logLevel: LOG_LEVEL = ERROR;
if (process.env.NODE_ENV !== "production") {
  logLevel = DEBUG;
}

setLogLevel(logLevel);
export = ExtensionReloaderImpl;
