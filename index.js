/**
 * Plugin Name: plugin-generate
 *
 * Authors: gindis
 */

const fse = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const spinner = ora();

const generatePlugin = async option => {
  let { data, config, filePath } = option;
  let result = {
    errorList: []
  };
  if (!data) return { message: '参数不对' };
  const panelDisplay = data.code && data.code.panelDisplay || data.data.code.panelDisplay;

  if (!fse.existsSync(filePath)) {
    fse.mkdirSync(filePath);
  }

  try {
    let index = 0;
    for (const item of panelDisplay) {
      let value = item.panelValue;
      const { panelName } = item;
      let outputFilePath = `${filePath}/${panelName}`;
      let itemFilePath = item.filePath || item.folder || '';
      if (item && itemFilePath) {
        itemFilePath = itemFilePath.endsWith('/') ? itemFilePath : `${itemFilePath}/`;
        let str = itemFilePath;
        if (typeof str === 'string') {
          str =
            str.substring(str.length - 1) == '/'
              ? str.substring(0, str.length - 1)
              : str;
        }
        const strArr = str.split('/');
        let folder = `${option.filePath}`;
        for (const strItem of strArr) {
          folder = `${folder}/${strItem}`;
          if (!fse.existsSync(folder)) {
            fse.mkdirSync(folder);
          }
        }
        outputFilePath = `${filePath}/${itemFilePath}${panelName}`;
      }

      // Depend on merge processing for package
      try {
        if (panelName === 'package.json') {
          const packagePath = `${filePath}/package.json`;
          const newPackage = JSON.parse(value) || null;
          if (newPackage && fse.existsSync(packagePath)) {
            let packageJson = await fse.readJson(packagePath);
            if (!packageJson.dependencies) {
              packageJson.dependencies = {};
            }
            const newDependencies = Object.assign(
              newPackage.dependencies,
              packageJson.dependencies
            );
            packageJson.dependencies = newDependencies;
            value = JSON.stringify(packageJson, null, 2);
          }
        }
      } catch (error) {
        result.errorList.push(error);
      } finally {
      }
      await fse.writeFile(outputFilePath, value, 'utf8');
      index++;
    }
  } catch (error) {
    result.errorList.push(error);
  }

  return { data, filePath, config, result };
};

module.exports = (...args) => {
  return generatePlugin(...args).catch(err => {
    console.log(chalk.red(err));
  });
};
