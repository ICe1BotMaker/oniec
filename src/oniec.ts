#!/usr/bin/env node
import { exec } from "child_process";
import chalk from "chalk";
import fs from 'fs';
import ts from 'typescript';

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

        /**
         * @param {'unlink' | 'rename'} type
         */
        const detOry = (type: string, path: string, arr: any[]) => {
            fs.readdirSync(path).forEach(file => {
                if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
                    detOry(type, `${path}/${file}/`, arr);
                } else {
                    if (arr.includes(file) && type === `unlink`) {
                        fs.unlinkSync(`${path}/${file}`);
                    } else if (type === `nots`) {
                        arr.forEach(val => {
                            if (file.includes(val[0])) {
                                if (fs.existsSync(`${path}/${file}`)) {
                                    const idx = arr.findIndex(val => file.includes(val[0]));
                                    const content = fs.readFileSync(`${path}/${file}`, `utf-8`);
                                    
                                    const compilerOptions: ts.CompilerOptions = {
                                        target: ts.ScriptTarget.Latest,
                                        module: ts.ModuleKind.ES2022,
                                        jsx: ts.JsxEmit.React
                                    };
                                    
                                    const result = ts.transpileModule(content, {
                                        compilerOptions,
                                    });

                                    fs.unlinkSync(`${path}/${file}`);
                                    fs.writeFileSync(`${path}/${file.replace(arr[idx][0], arr[idx][1])}`, result.outputText);
                                }
                            }
                        });
                    }
                }
            });
        }

        const config: { typescript: boolean, name: object, structure: object, default: boolean } = JSON.parse(fs.readFileSync(`${__dirname}/../oniecconfig.json`, `utf-8`));

        console.log(`\n${chalk.gray(`[config-default]`)}: ${chalk.yellow(config.default)}`);
        
        console.log(`${chalk.gray(`[config-typescript]`)}: ${chalk.yellow(config.typescript)}`);

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

        console.log(`${chalk.gray(`[config-structure]`)}: ${chalk.gray(JSON.stringify(config.structure).substring(0, 50))}...`);

        const struct = (structure: object) => {
            Object.keys(structure).forEach((key: string, idx: number) => {
                const value: object = Object.values(structure)[idx];

                const _struct = (value: object, path: string) => {
                    if (typeof value !== `object`) return;
                    
                    if (Object.keys(value).length > 0) {
                        Object.keys(value).forEach((val, _idx) => {
                            const _value: object = Object.values(value)[_idx];

                            fs.mkdirSync(`${path}/${key}/${val}`);
                            fs.readdirSync(`${path}/${val}`).forEach(file => {
                                const content = fs.readFileSync(`${path}/${val}/${file}`, `utf-8`);
                                fs.writeFileSync(`${path}/${key}/${val}/${file}`, content);
                                fs.unlinkSync(`${path}/${val}/${file}`);
                            });
                            fs.rmdirSync(`${path}/${val}`);
    
                            _struct(_value, `${path}/${val}`);
                        });
                    }
                }
                
                _struct(value, `./${project_name}/src`);
            });
        }

        struct(config.structure);
        
        console.log(`${chalk.gray(`[config-name]`)}: ${chalk.gray(JSON.stringify(config.name).substring(0, 50))}...`);

        const drname = (path: string) => {
            Object.keys(config.name).forEach((key: string, idx: number) => {
                const value = Object.values(config.name)[idx];
    
                if (fs.existsSync(path)) {
                    fs.readdirSync(path).forEach(file => {
                        if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
                            if (key === file) {
                                fs.renameSync(`${path}/${file}`, `${path}/${value}`);
                            }
                            
                            drname(`${path}/${file}`);
                        }
                    });
                }
            });
        }

        drname(`./${project_name}/src`);

        console.log(`\n${chalk.gray(`[npm-install]`)}: ${chalk.cyan(`react`)}`);
        console.log(`${chalk.gray(`[npm-install]`)}: ${chalk.gray(`please wait...`)}`);

        exec(`npm install --save --legacy-peer-deps`, { cwd: `${project_name}` }, (err, stdout, stderr) => {
            console.log(chalk.yellow(stdout));
            console.log(`${chalk.gray(`[npm]`)}: ${chalk.cyan(`happy hacking ;)`)}`);
        });
    });
});