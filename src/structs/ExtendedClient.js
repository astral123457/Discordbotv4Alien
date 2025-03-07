"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
var discord_js_1 = require("discord.js");
var dotenv_1 = require("dotenv");
var fs_1 = require("fs");
var path_1 = require("path");
dotenv_1.default.config();
var fileCondition = function (fileName) { return fileName.endsWith(".ts") || fileName.endsWith(".js"); };
var ExtendedClient = /** @class */ (function (_super) {
    __extends(ExtendedClient, _super);
    function ExtendedClient() {
        var _this = _super.call(this, {
            intents: Object.keys(discord_js_1.IntentsBitField.Flags),
            partials: [
                discord_js_1.Partials.Channel, discord_js_1.Partials.GuildMember, discord_js_1.Partials.GuildScheduledEvent,
                discord_js_1.Partials.Message, discord_js_1.Partials.Reaction, discord_js_1.Partials.ThreadMember, discord_js_1.Partials.User
            ]
        }) || this;
        _this.commands = new discord_js_1.Collection();
        _this.buttons = new discord_js_1.Collection();
        _this.selects = new discord_js_1.Collection();
        _this.modals = new discord_js_1.Collection();
        return _this;
    }
    ExtendedClient.prototype.start = function () {
        this.registerModules();
        this.registerEvents();
        this.login(process.env.BOT_TOKEN);
    };
    ExtendedClient.prototype.registerCommmands = function (commands) {
        var _a;
        (_a = this.application) === null || _a === void 0 ? void 0 : _a.commands.set(commands).then(function () {
            console.log("✅ Slash commands (/) defined".green);
        }).catch(function (error) {
            console.log("\u274C An error occurred while trying to set the Slash Commands (/): \n".concat(error).red);
        });
    };
    ExtendedClient.prototype.registerModules = function () {
        var _this = this;
        var slashCommads = new Array();
        var commandsPath = path_1.default.join(__dirname, "..", "commands");
        fs_1.default.readdirSync(commandsPath).forEach(function (Local) {
            fs_1.default.readdirSync(commandsPath + "/".concat(Local, "/")).filter(fileCondition).forEach(function (fileName) { return __awaiter(_this, void 0, void 0, function () {
                var commandModule, command, name_1, buttons, selects, modals;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("Importando comando: ../commands/".concat(Local, "/").concat(fileName));
                            return [4 /*yield*/, Promise.resolve("".concat("../commands/".concat(Local, "/").concat(fileName))).then(function (s) { return require(s); })];
                        case 1:
                            commandModule = _a.sent();
                            console.log("M\u00F3dulo de comando importado: ".concat(JSON.stringify(commandModule)));
                            if (!(commandModule === null || commandModule === void 0 ? void 0 : commandModule.default)) {
                                console.error("O m\u00F3dulo de comando padr\u00E3o est\u00E1 indefinido para o arquivo: ".concat(fileName));
                                return [2 /*return*/];
                            }
                            command = commandModule.default;
                            console.log("Comando: ".concat(JSON.stringify(command)).yellow);
                            if (command) {
                                name_1 = command.name, buttons = command.buttons, selects = command.selects, modals = command.modals;
                                console.log("Nome do comando: ".concat(name_1).yellow);
                                if (name_1) {
                                    this.commands.set(name_1, command);
                                    slashCommads.push(command);
                                    if (buttons)
                                        buttons.forEach(function (run, key) { return _this.buttons.set(key, run); });
                                    if (selects)
                                        selects.forEach(function (run, key) { return _this.selects.set(key, run); });
                                    if (modals)
                                        modals.forEach(function (run, key) { return _this.modals.set(key, run); });
                                }
                            }
                            else {
                                console.error("Comando est\u00E1 indefinido para o arquivo: ".concat(fileName));
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        this.on("ready", function () { return _this.registerCommmands(slashCommads); });
    };
    ExtendedClient.prototype.registerEvents = function () {
        var _this = this;
        var eventsPath = path_1.default.join(__dirname, "..", "events");
        fs_1.default.readdirSync(eventsPath).forEach(function (local) {
            fs_1.default.readdirSync("".concat(eventsPath, "/").concat(local)).filter(fileCondition)
                .forEach(function (fileName) { return __awaiter(_this, void 0, void 0, function () {
                var _a, name, once, run;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, Promise.resolve("".concat("../events/".concat(local, "/").concat(fileName))).then(function (s) { return require(s); })];
                        case 1:
                            _a = (_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.default, name = _a.name, once = _a.once, run = _a.run;
                            try {
                                if (name)
                                    (once) ? this.once(name, run) : this.on(name, run);
                            }
                            catch (error) {
                                console.log("An error occurred on event: ".concat(name, " \n").concat(error).red);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return ExtendedClient;
}(discord_js_1.Client));
exports.ExtendedClient = ExtendedClient;
