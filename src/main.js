const program = require("commander");
const { version, engines } = require("./utils/constants");
const minimist = require("minimist");
const chalk = require("chalk");
const semver = require("semver");
const requiredVersion = engines.node;

// 检测node版本函数
/**
 *
 * @param {*} wanted
 * @param {*} id
 */
function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        "你是用的Node版本号为： " +
          process.version +
          ", 但 " +
          id +
          " 需运行在 " +
          wanted +
          ".\n请升级你的Node版本"
      )
    );
    process.exit(1);
  }
}

checkNodeVersion(requiredVersion, "awesome-test-cli");

if (semver.satisfies(process.version, "9.x")) {
  console.log(
    chalk.red(
      `你是用的Node版本是 ${process.version}.\n` + `强烈建议你使用最新 LTS 版本`
    )
  );
}
program.version(version).usage("<command> [options]");

// 创建命令
program
  .command("create <app-name>")
  .description("create a new project")
  .option(
    "-p, --preset <presetName>",
    "Skip prompts and use saved or remote preset"
  )
  .option("-d, --default", "Skip prompts and use default preset")
  .action((name, cmd) => {
    const options = cleanArgs(cmd);
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(
        chalk.yellow(
          "\n ⚠️  检测到您输入了多个名称，将以第一个参数为项目名，舍弃后续参数哦"
        )
      );
    }
    require("./create")(name, options);
  });
program.parse(process.argv);
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}
// 获取参数
function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach((o) => {
    const key = camelize(o.long.replace(/^--/, ""));
    // 如果没有传递option或者有与之相同的命令，则不被拷贝
    if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
      args[key] = cmd[key];
    }
  });
  return args;
}
