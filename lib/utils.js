// 首字母转大写
const toUpperCase = ([first, ...rest]) => first.toUpperCase() + rest.join("");

// 下划线转换驼峰
function toHumpCase(name) {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}
// 驼峰转换下划线
function toLineCase(name) {
  return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}

module.exports = {
  toUpperCase,
  toHumpCase,
  toLineCase,
};
