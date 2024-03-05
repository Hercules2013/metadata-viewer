const fs = require('fs')
const path = require('path')

const [_, scriptName, originDir, targetDir] = process.argv
const allowedExtensions = ['.exe', '.app', '.dmg', '.deb']

!fs.existsSync(targetDir) && fs.mkdirSync(targetDir)

const moveWhitelistedFiles = dir => {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) moveWhitelistedFiles(filePath)
    else {
      const extension = path.extname(file)
      if (allowedExtensions.indexOf(extension.toLowerCase()) >= 0)
        fs.createReadStream(filePath).pipe(fs.createWriteStream(path.join(targetDir, file)))
    }
  }
}

moveWhitelistedFiles(originDir)
