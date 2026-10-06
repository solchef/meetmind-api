"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cli_engine_1 = require("@prisma/cli-engine");
const config_1 = require("@prisma/orm-postgres/config");
exports.default = (0, cli_engine_1.definePrismaConfig)({
    orm: (0, config_1.defineConfig)({
        contract: "./src/prisma/contract.prisma",
        db: {
            connection: process.env['DATABASE_URL'],
        },
    }),
});
//# sourceMappingURL=prisma.config.js.map