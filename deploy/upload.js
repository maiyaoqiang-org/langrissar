const OSS = require('ali-oss');
const path = require("path")
const fs = require('fs')
const dotenv = require("dotenv");
const ora = require('ora');
const getArg = (key) => {
  let arg = process.argv.find(item => {
    return item.startsWith(key)
  })
  return arg.replace(key, '')
}
// const env = getArg('--env=')
// 设置当前读取.env环境变量
dotenv.config({ path: `.env.local` })


const uploadFileDir = path.join('../',process.env.VITE_APP_LOCAL_FILE_PATH)
const ossFileDir = process.env.VITE_APP_UPLOAD_PATH
const client = new OSS({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: process.env.VITE_APP_UPLOAD_REGION,
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: process.env.VITE_APP_UPLOAD_ACCESS_KEY_ID,
  accessKeySecret: process.env.VITE_APP_UPLOAD_ACCESS_KEY_SECRET,
  bucket: process.env.VITE_APP_UPLOAD_BUCKET,
});

// 把fs方法转promise
let makePromiseUtil = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      [].push.call(args, (err, ret) => {
        if (err) {
          reject(err)
        } else {
          resolve(ret)
        }
      })
      fn.apply(null, args)
    })
  }
};
let statPromise = makePromiseUtil(fs.stat)
let readdirPromise = makePromiseUtil(fs.readdir);

let readFilesFormDir = (dir) => {
  return statPromise(dir).then((stats) => {
    let ret;
    if (stats.isDirectory()) {
      ret = readdirPromise(dir).then((files) => {
        return Promise.all(files.map(file => readFilesFormDir(path.join(dir, file))))
      }).then((paths) => {
        return [].concat(...paths)
      })
      ret = ret || []
    } else if (stats.isFile()) {
      ret = dir
    }
    return ret
  })
}

const headers = {
  // 指定Object的存储类型。
  'x-oss-storage-class': 'Standard',
  // 指定Object的访问权限。
  // 'x-oss-object-acl': 'private',
  // 设置Object的标签，可同时设置多个标签。
  // 'x-oss-tagging': 'Tag1=1&Tag2=2',
  // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
  // 'x-oss-forbid-overwrite': 'true',
};



async function putFile(uploadFileDir, ossFileDir) {
  const uploadDir = path.join(__dirname, uploadFileDir)
  let paths = await readFilesFormDir(uploadDir)
  let total = paths.length
  let index = 0
  const buildPlan = ora();
  buildPlan.info("开始执行上传")
  buildPlan.start();
  const setProgress = (progress) => {
    buildPlan.text = `上传进度:${progress}%`
  }
  setProgress(0)

  try {
    const res = await Promise.all(paths.map((filePath) => {
      return client.put(
        // 上传地址
        path.join(ossFileDir, filePath.replace(uploadDir, '')).replace(/\\/g, "\/"),
        // 本地待上传文件地址
        filePath,
        { headers }
      ).then(() => {
        index++
        const progress = (index / total * 100).toFixed(2)
        setProgress(progress)
      })
    }))
  } catch (error) {
    console.log(error);
  }
  buildPlan.succeed("上传完成");
}

putFile(uploadFileDir, ossFileDir);
