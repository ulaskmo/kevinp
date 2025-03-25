"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movieController_1 = require("../controllers/movieController");
const router = express_1.default.Router();
router.get('/', movieController_1.getMovies);
router.get('/:id', movieController_1.getMovieById); // Correct usage here
router.post('/', movieController_1.createMovie);
router.put('/:id', movieController_1.updateMovie);
router.delete('/:id', movieController_1.deleteMovie);
router.delete('/last', movieController_1.deleteLastMovie); // New route to delete the last added movie
exports.default = router;
