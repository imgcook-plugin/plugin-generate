/**
 * @param option: { data, filePath, config }
 * - data: 模块和生成代码
 * - filePath: 下载文件存放目录
 * - config: cli 配置
 */

const pluginExample = async (option) => {
  return option;
};

module.exports = (...args) => {
  return pluginExample(...args).catch(err => {
    console.log(err);
  });
};
