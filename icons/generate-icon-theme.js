const { writeFileSync, readFileSync } = require("fs");

const folderIcons = JSON.parse(readFileSync("./icons/folder-icons.json"));
const fileIcons = JSON.parse(readFileSync("./icons/file-icons.json"));

const fileLightMode = JSON.parse(readFileSync("./icons/file-icon-theme-light-mode.json"));
const folderLightMode = JSON.parse(readFileSync("./icons/folder-icon-theme-light-mode.json"));
const fileDarkMode = JSON.parse(readFileSync("./icons/file-icon-theme-dark-mode.json"));
const folderDarkMode = JSON.parse(readFileSync("./icons/folder-icon-theme-dark-mode.json"));

const final = {
  iconDefinitions: { ...folderIcons, ...fileIcons },
  light: { ...fileLightMode, ...folderLightMode },
  ...fileDarkMode,
  ...folderDarkMode
};

writeFileSync("./icons/jetbrains-icon-theme.json", JSON.stringify(final, null, 2));
