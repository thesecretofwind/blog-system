onmessage = async (e) => {
  const { file, CHUNK_SIZE, startIndex, endIndex, uuid } = e.data;
  //   console.log(file);

  // 根据文件大小，划分一个个相同大小的chunk，默认大小为0.5M
  const fileList = createChunk(file, startIndex, endIndex, CHUNK_SIZE);
  console.log(fileList.map((item) => item.index));
  // console.log(fileList);

  // 使用uuid作为文件名
  // const uuid = crypto.randomUUID();
  // 封装切片请求
  // const uploadList = fileList.map(({tempfile, index}) => {
  //     const formData = new FormData();    // 定义上次的数据
  //     formData.append('chunk', tempfile); // 切片信息
  //     formData.append('chunkname', `${uuid}@${index}`);    // 名字
  //     formData.append('filename', uuid); // 文件名
  //     return fetch('/upload_file_chunk', {
  //         method: 'POST',
  //         body: formData
  //     });
  // });

  // Promise.all(uploadList).then(res => {
  //     postMessage({
  //         startIndex
  //     });
  // })
  uploadChunk(fileList, startIndex);

  function createChunk(file, startIndex, endIndex, chunksize) {
    const result = [];

    while (startIndex < endIndex) {
      let start = startIndex * chunksize;
      let end = start + chunksize;
      // console.log(start, end);
      result.push({
        tempfile: file.slice(start, Math.min(end, file.size)),
        index: startIndex,
      });
      startIndex++;
    }
    return result;
  }

  // function createChunk(file, size = 5 * 1024 * 1024) {
  //     const result = [];
  //     // 当前切片开始位置
  //     let i = 0;
  //     // file.size表示文件大小
  //     while(i < file.size) {
  //         result.push(file.slice(i, Math.min(i+size, file.size)));
  //         i += size;
  //     }

  //     return result;
  // }

  function uploadChunk(chunklist = [], startIndex) {
    const LIMIT = 4;
    let cur = 0;

    while (chunklist.length && cur < LIMIT) {
      cur++;
      request();
    }

    function buildFormData() {
      const { tempfile, index } = chunklist.shift();
      const formData = new FormData(); // 定义上次的数据
      formData.append('chunk', tempfile); // 切片信息
      formData.append('chunkname', `${uuid}@${index}`); // 名字
      formData.append('filename', uuid); // 文件名
      return formData;
    }

    function request() {
      const formData = buildFormData();

      // function autoRetry(formData) {
      return fetch('/upload/upload_file_chunk', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          // if (res.status === 200) {
          request(cur++);
          // }

          if (chunklist.length === 0) {
            postMessage({
              startIndex,
            });
            return;
          }

          // throw new Error("request error", res.status);
        });
      // .catch((err) => {
      //   retryTimes--;
      //   if (retryTimes < 0) {
      //     throw new Error("over max request times!", err);
      //   }
      // });
    }

    // return autoRetry(formData);
    // }
  }
};

// function maxRequest(url = "", times = 3) {
//   function autoRetry(url) {
//     times--;

//     return fetch(url)
//       .then((res) => {
//         if (res.status == 200) {
//           return res;
//         }
//         throw new Error("http code error", res.status);
//       })
//       .catch((err) => {
//         if (times < 1) {
//           throw new Error("over max request times");
//         } else {
//           return autoRetry(url, times);
//         }
//       });
//   }

//   return autoRetry(url);
// }

// function uploadchunks(fileList) {
//   const LIMIT = 5;
//   let i = 0;
//   let active = 0;

//   while (i < fileList.length && active < LIMIT) {
//     next();
//   }

//   function next() {
//     if (i === fileList.length) return;
//     const filechunk = fileList[i++];
//     const formData = new FormData();
//     formData.append("chunk", filechunk);
//     active++;

//     fetch("/upload_chunk", {
//       method: "POST",
//       body: formData,
//     }).then(() => {
//       active--;
//       if (active < LIMIT) {
//         next();
//       }
//     });
//   }
// }
