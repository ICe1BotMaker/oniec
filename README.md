# 💫 react oniec &nbsp;-&nbsp; <img src="./react-logo.png" width="20px"> <img src="./node-logo.png" width="17px"> <img src="./npm-logo.png" width="40px">

After ***React*** was installed, it was created so that developers would not do anything annoying and unpleasant, such as adding ***typescript*** files, creating folders, declaring types for images, and creating ***stylesheet*** files.

***Links: [npm](https://www.npmjs.com/package/create-oniec-app), [github](https://github.com/ICe1BotMaker/oniec)***

### 💬 Differences from traditional *React* installations

- All unnecessary files are installed deleted.
- Add default settings for ***typescript***
- Set up to use ***react-router-dom***
- Set up to use ***react custom hook***
- Set up for **Landing Page** and **Error Page**.
- In addition, it also removes the default settings for `margin` and `padding` in the browser.

### 💬 Precautions for Use

The ***create-oniec-app*** library uses the `exec` function of the library called ***child_process***. When a function is used, problems such as deleting or modifying existing files can occur.

### 📌 Installation

Read [***precautions***](#💬-precautions-for-use) before installing!

#### ✅ How to modify the file ***oneiecconfig.json***

- Locate ***oneiecconfig.json*** in the path where this module is installed.
- Open the file in the editor and modify the desired part.

##### 💾 To modify

- ***typescript***: typescript enable
- ***name***: Desired directory name
- ***structure***: Desired directory structure

Run from the shell of the operating system:

```
$ npm install -g create-oniec-app
$ npx create-oniec-app <your-project-name>
```

<img src="./npm-install.png" width="75%">

### 🎬 How to run

Run from the shell of the operating system:

```
$ cd <your-project-location>
$ npm run dev
```

### 📂 Directory structure

Everything changed from version 1.1.0

- You can modify `oniecconfig.json` to change the directory structure as you want, or set the directory name, ***typescript***, or not.

### Release

- [x] version 1.\*.*