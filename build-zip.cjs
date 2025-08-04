const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// 创建zip文件的函数
async function createZip() {
  // 检查dist目录是否存在
  if (!fs.existsSync('dist')) {
    console.error('错误：dist目录不存在');
    process.exit(1);
  }

  // 检查dist.zip是否已存在，如果存在则删除
  const zipPath = path.join('dist', 'dist.zip');
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  // 创建一个输出流
  const output = fs.createWriteStream(zipPath);
  
  // 创建一个archiver实例
  const archive = archiver('zip', {
    zlib: { level: 9 } // 设置压缩级别
  });

  // 监听错误
  output.on('error', (err) => {
    throw err;
  });

  // 监听打包完成
  output.on('close', () => {
    console.log(`打包完成，生成了 ${archive.pointer()} 字节的 dist/dist.zip 文件`);
  });

  // 关联流
  archive.pipe(output);

  // 添加dist目录中的所有文件到压缩包（除了dist.zip本身）
  archive.glob('**/*', {
    cwd: 'dist',
    ignore: ['dist.zip']
  });

  // 完成打包
  await archive.finalize();
}

createZip().catch(error => {
  console.error('打包过程中出现错误:', error.message);
  process.exit(1);
});
