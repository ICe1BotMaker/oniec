#!/usr/bin/env node
import { exec } from "child_process";
import chalk from "chalk";
import fs from 'fs';

const project_name = process.argv[2];

console.log(`[ project info ]\n`);
console.log(`${chalk.gray(`[project-name]`)}: ${chalk.cyan(project_name)}\n`);

exec(`mkdir ${project_name}`, { cwd: `./` }, () => {
    console.log(`${chalk.gray(`[copy-directory-from]`)}: ${chalk.green(`${__dirname}\\..\\oniec-dir\\`)}`);
    console.log(`${chalk.gray(`[copy-directory-to]`)}: ${chalk.green(`./${project_name}`)}\n`);

    exec(`xcopy ${__dirname}\\..\\oniec-dir\\ ${project_name} /E`, { cwd: `./` }, () => {
        console.log(`${chalk.gray(`[package-json]`)}: ${chalk.red(`"name": "oniec"`)} -> ${chalk.green(`"name": "${project_name}"`)}`);
        let package_json_content = fs.readFileSync(`./${project_name}/package.json`, `utf-8`);
        package_json_content = package_json_content.replace(/"name": "oniec"/g, `"name": "${project_name}"`);
        fs.writeFileSync(`./${project_name}/package.json`, package_json_content);

        console.log(`${chalk.gray(`[package-lock-json]`)}: ${chalk.red(`"name": "oniec"`)} -> ${chalk.green(`"name": "${project_name}"`)}`);
        let package_lock_json_content = fs.readFileSync(`./${project_name}/package-lock.json`, `utf-8`);
        package_lock_json_content = package_lock_json_content.replace(/"name": "oniec"/g, `"name": "${project_name}"`);
        fs.writeFileSync(`./${project_name}/package-lock.json`, package_lock_json_content);

        console.log(`\n${chalk.gray(`[npm-install]`)}: ${chalk.cyan(`react`)}`);
        console.log(`${chalk.gray(`[npm-install]`)}: ${chalk.gray(`please wait...`)}`);

        exec(`npm install --save --legacy-peer-deps`, { cwd: `${project_name}` }, (err, stdout, stderr) => {
            console.log(chalk.yellow(stdout));
            console.log(`${chalk.gray(`[npm]`)}: ${chalk.cyan(`happy hacking ;)`)}`);
        });
    });
});