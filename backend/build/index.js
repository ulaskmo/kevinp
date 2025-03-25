"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
const movieRoutes_1 = __importDefault(require("./routes/movieRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/movies', movieRoutes_1.default);
app.use('/api/customers', customerRoutes_1.default);
const PORT = process.env.PORT || 3000;
(0, database_1.connectToDb)(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
