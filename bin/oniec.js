#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
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
        console.log(`\n${chalk_1.default.gray(`[npm-install]`)}: ${chalk_1.default.cyan(`react`)}`);
        console.log(`${chalk_1.default.gray(`[npm-install]`)}: ${chalk_1.default.gray(`please wait...`)}`);
        (0, child_process_1.exec)(`npm install --save --legacy-peer-deps`, { cwd: `${project_name}` }, (err, stdout, stderr) => {
            console.log(chalk_1.default.yellow(stdout));
            console.log(`${chalk_1.default.gray(`[npm]`)}: ${chalk_1.default.cyan(`happy hacking ;)`)}`);
        });
    });
});
