import { Injectable } from '@nestjs/common';

import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  // constructor(@Res() res: Response){}

  async upload(
    res: Response,
    chunk: Express.Multer.File,
    { filename, chunkname },
  ) {
    const chunkDir = path.join('./public/uploads/chunk', filename);
    const outputFile = chunkDir + '/' + chunkname;

    fs.mkdir(chunkDir, { recursive: true }, (mkdirErr) => {
      if (mkdirErr) {
        return res.json({ code: 0, data: {} });
      }

      fs.writeFile(outputFile, chunk.buffer, () => {
        res.json({ code: 1, data: '上传切片成功' });
      });
    });
  }

  async merge(mergeDto: any) {
    const { filename, extname } = mergeDto;
    const sourceDir = `./public/uploads/chunk/${filename}`;
    const targetFile = `./public/uploads/chunk/${filename}.${extname}`;
    this.chunkStreamMerge(sourceDir, targetFile);

    return { code: targetFile.replace('public', 'static') };
  }

  /**
   * 文件合并
   * @param {*} sourceFiles 源文件
   * @param {*} targetFile  目标文件
   */
  chunkStreamMerge(sourceFiles, targetFile) {
    const chunkFilesDir = sourceFiles;
    const list = fs.readdirSync(chunkFilesDir); // 读取目录中的文件

    // 由于是创建异步流读取，因此文件的顺序可能会更改，因此需要sort保证文件顺序一致
    list.sort((a, b) => {
      const aIndex = a.split('@')[1];
      const bIndex = b.split('@')[1];

      return Number(aIndex) - Number(bIndex);
    });
    console.log(list);
    const fileList = list.map((name) => ({
      name,
      filepath: path.resolve(chunkFilesDir, name),
    }));
    const fileWriteStream = fs.createWriteStream(targetFile);

    this.chunkStreamMergeProgress(fileList, fileWriteStream, sourceFiles);
  }

  /**
   * 递归合并每一个切片
   * @param {*} fileList 文件数据
   * @param {*} fileWriteStream 最终写入结果
   * @param {*} sourceFiles 文件路径
   */
  chunkStreamMergeProgress(fileList, fileWriteStream, sourceFiles) {
    if (!fileList.length) {
      // 完成了
      fileWriteStream.end();

      // 删除临时目录
      // if (sourceFiles) {
      //     fsExtra.removeSync(sourceFiles);
      // }
      this.deleteFilesInDirectory(sourceFiles);
      return;
    }

    const data = fileList.shift(); // 读取第一个文件数据
    // 解构重命名
    const { filepath: chunkFilePath } = data;
    const currentReadStream = fs.createReadStream(chunkFilePath); // 读取文件
    // 吧结果往最终的生成文件上进行拼接
    currentReadStream.pipe(fileWriteStream, { end: false });
    currentReadStream.on('end', () => {
      // 拼接完成后，进入下一个循环
      this.chunkStreamMergeProgress(fileList, fileWriteStream, sourceFiles);
    });
  }

  deleteFilesInDirectory(directoryPath) {
    // 读取目录下的所有文件
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }

      // 遍历目录中的所有文件
      files.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        // 删除文件
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return;
          }

          console.log('File deleted:', filePath);
        });
      });
    });
  }
}
