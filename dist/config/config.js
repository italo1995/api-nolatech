"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const AppConfig_1 = __importDefault(require("./AppConfig"));
const config = {
    local: {
        host: AppConfig_1.default.DB_HOST,
        logging: false,
        define: {
            freezeTableName: true
        },
    },
    development: {
        host: AppConfig_1.default.DB_HOST,
        logging: false,
        define: {
            freezeTableName: true
        },
    },
    test: {
        host: AppConfig_1.default.DB_HOST,
        logging: false,
        define: {
            freezeTableName: true
        }
    },
    production: {
        host: AppConfig_1.default.DB_HOST,
        logging: false,
        define: {
            freezeTableName: true
        }
    }
};
module.exports = Object.freeze(config);
//# sourceMappingURL=config.js.map