const fs = require("fs");
const path = require("path");
const multer = require("multer");
const uuid = require("uuid");

const memoryDest = path.join(__dirname, "../public/uploads");

const storage = multer.diskStorage({
  // 文件存储位置
  destination: (req, file, cb) => {
    // 校验文件夹是否存在，如果不存在则创建一个
    const isExists = fs.existsSync(memoryDest);
    if (!isExists) {
      fs.mkdirSync(memoryDest);
    }
    cb(null, memoryDest);
  },
  filename: (req, file, cb) => {
    const uid = uuid.v1();
    let ext = path.extname(file.originalname);
    cb(null, `${uid}${ext}`);
  },
});

//过滤文件
function fileFilter(req, file, cb) {
  if (!file) {
    cb(null, false);
  } else {
    cb(null, true);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
}).single("file");

module.exports = upload;
