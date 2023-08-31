#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const typescript_1 = __importDefault(require("typescript"));
const project_name = process.argv[2];
console.log(`[ project info ]\n`);
console.log(`${chalk_1.default.gray(`[project-name]`)}: ${chalk_1.default.cyan(project_name)}\n`);
(0, child_process_1.exec)(`mkdir ${project_name}`, { cwd: `./` }, () => {
    console.log(`${chalk_1.default.gray(`[copy-directory-from]`)}: ${chalk_1.default.green(`${__dirname}\\..\\oniec-dir\\`)}`);
    console.log(`${chalk_1.default.gray(`[copy-directory-to]`)}: ${chalk_1.default.green(`./${project_name}`)}\n`);
    (0, child_process_1.exec)(`xcopy ${__dirname}\\..\\oniec-dir\\ ${project_name} /E`, { cwd: `./` }, () => {
        console.log(`${chalk_1.default.gray(`[package-json]`)}: ${chalk_1.default.red(`"name": "oniec"`)} -> ${chalk_1.default.green(`"name": "${project_name}"`)}`);
        let package_json_content = fs_1.default.readFileSync(`./${project_name}/package.json`, `utf-8`);
        package_json_content = package_json_content.replace(/"name": "oniec"/g, `"name": "${project_name}"`);
        fs_1.default.writeFileSync(`./${project_name}/package.json`, package_json_content);
        console.log(`${chalk_1.default.gray(`[package-lock-json]`)}: ${chalk_1.default.red(`"name": "oniec"`)} -> ${chalk_1.default.green(`"name": "${project_name}"`)}`);
        let package_lock_json_content = fs_1.default.readFileSync(`./${project_name}/package-lock.json`, `utf-8`);
        package_lock_json_content = package_lock_json_content.replace(/"name": "oniec"/g, `"name": "${project_name}"`);
        fs_1.default.writeFileSync(`./${project_name}/package-lock.json`, package_lock_json_content);
        /**
         * @param {'unlink' | 'rename'} type
         */
        const detOry = (type, path, arr) => {
            fs_1.default.readdirSync(path).forEach(file => {
                if (fs_1.default.lstatSync(`${path}/${file}`).isDirectory()) {
                    detOry(type, `${path}/${file}/`, arr);
                }
                else {
                    if (arr.includes(file) && type === `unlink`) {
                        fs_1.default.unlinkSync(`${path}/${file}`);
                    }
                    else if (type === `nots`) {
                        arr.forEach(val => {
                            if (file.includes(val[0])) {
                                if (fs_1.default.existsSync(`${path}/${file}`)) {
                                    const idx = arr.findIndex(val => file.includes(val[0]));
                                    const content = fs_1.default.readFileSync(`${path}/${file}`, `utf-8`);
                                    const compilerOptions = {
                                        target: typescript_1.default.ScriptTarget.Latest,
                                        module: typescript_1.default.ModuleKind.ES2022,
                                        jsx: typescript_1.default.JsxEmit.React
                                    };
                                    const result = typescript_1.default.transpileModule(content, {
                                        compilerOptions,
                                    });
                                    fs_1.default.unlinkSync(`${path}/${file}`);
                                    fs_1.default.writeFileSync(`${path}/${file.replace(arr[idx][0], arr[idx][1])}`, result.outputText);
                                }
                            }
                        });
                    }
                }
            });
        };
        const config = JSON.parse(fs_1.default.readFileSync(`${__dirname}/../oniecconfig.json`, `utf-8`));
        console.log(`\n${chalk_1.default.gray(`[config-default]`)}: ${chalk_1.default.yellow(config.default)}`);
        console.log(`${chalk_1.default.gray(`[config-typescript]`)}: ${chalk_1.default.yellow(config.typescript)}`);
        if (!config.typescript) {
            detOry(`unlink`, `./${project_name}`, [
                "tsconfig.json",
                "index.d.ts"
            ]);
            detOry(`nots`, `./${project_name}`, [
                [".tsx", ".jsx"],
                [".ts", ".js"]
            ]);
        }
        console.log(`${chalk_1.default.gray(`[config-structure]`)}: ${chalk_1.default.gray(JSON.stringify(config.structure).substring(0, 50))}...`);
        const struct = (structure) => {
            Object.keys(structure).forEach((key, idx) => {
                const value = Object.values(structure)[idx];
                const _struct = (value, path) => {
                    if (typeof value !== `object`)
                        return;
                    if (Object.keys(value).length > 0) {
                        Object.keys(value).forEach((val, _idx) => {
                            const _value = Object.values(value)[_idx];
                            fs_1.default.mkdirSync(`${path}/${key}/${val}`);
                            fs_1.default.readdirSync(`${path}/${val}`).forEach(file => {
                                const content = fs_1.default.readFileSync(`${path}/${val}/${file}`, `utf-8`);
                                fs_1.default.writeFileSync(`${path}/${key}/${val}/${file}`, content);
                                fs_1.default.unlinkSync(`${path}/${val}/${file}`);
                            });
                            fs_1.default.rmdirSync(`${path}/${val}`);
                            _struct(_value, `${path}/${val}`);
                        });
                    }
                };
                _struct(value, `./${project_name}/src`);
            });
        };
        struct(config.structure);
        console.log(`${chalk_1.default.gray(`[config-name]`)}: ${chalk_1.default.gray(JSON.stringify(config.name).substring(0, 50))}...`);
        const drname = (path) => {
            Object.keys(config.name).forEach((key, idx) => {
                const value = Object.values(config.name)[idx];
                if (fs_1.default.existsSync(path)) {
                    fs_1.default.readdirSync(path).forEach(file => {
                        if (fs_1.default.lstatSync(`${path}/${file}`).isDirectory()) {
                            if (key === file) {
                                fs_1.default.renameSync(`${path}/${file}`, `${path}/${value}`);
                            }
                            drname(`${path}/${file}`);
                        }
                    });
                }
            });
        };
        drname(`./${project_name}/src`);
        console.log(`\n${chalk_1.default.gray(`[npm-install]`)}: ${chalk_1.default.cyan(`react`)}`);
        console.log(`${chalk_1.default.gray(`[npm-install]`)}: ${chalk_1.default.gray(`please wait...`)}`);
        (0, child_process_1.exec)(`npm install --save --legacy-peer-deps`, { cwd: `${project_name}` }, (err, stdout, stderr) => {
            console.log(chalk_1.default.yellow(stdout));
            console.log(`${chalk_1.default.gray(`[npm]`)}: ${chalk_1.default.cyan(`happy hacking ;)`)}`);
        });
    });
});
