const { writeFileSync, readFileSync } = require("fs");

const folderIcons = JSON.parse(readFileSync("./icons/folder-icons.json"));
const fileIcons = JSON.parse(readFileSync("./icons/file-icons.json"));

const lightMode = JSON.parse(readFileSync("./icons/icon-theme-light-mode.json"));
const darkMode = JSON.parse(readFileSync("./icons/icon-theme-dark-mode.json"));
const final = {
  iconDefinitions: { ...folderIcons, ...fileIcons },
  light: { ...lightMode },
  ...darkMode
};

writeFileSync("./icons/jetbrains-icon-theme.json", JSON.stringify(final, null, 2));
