// function ajax(options) {
//     const defaults = {
//         type: 'get',
//         url: '',
//         data: {},
//         header: {
//             contenType: 'application/x-www-form-urlencoded'
//         },
//         success: function() {},
//         error: function (){},
//     };

//     const defaultOpions = {...defaults, options};

//     const xhr = new XMLHttpRequest();

//     let params = '';
//     const {data, type } = defaultOpions;
//     params = Object.keys(data).reduce((prev, key) => {
//         prev += `${key}=${data[key]}&`;
//         return prev;
//     });
//     params = params.substring(0, params.length - 1);

//     if (type == 'get') {
//         defaultOpions.url = defaultOpions.url + '?' + params;
//     }

//     xhr.open(defaults.type, defaultOpions.url);

//     if (defaultOpions.type === 'post') {
//         const contenType = defaultOpions.header['contenType'];
//         xhr.setRequestHeader('Content-Type', contenType);
//         if (contenType === 'application/json') {
//             xhr.send(JSON.stringify(defaultOpions.data));
//         } else {
//             xhr.send(params);
//         }
//     } else {
//         xhr.send();
//     }

//     xhr.onload = function () {
//         const contentType = xhr.getResponseHeader('Content-Type');
//         let responseText = xhr.responseText;
//         if (contentType.includes('application/json')) {
//             responseText = JSON.parse(responseText);
//         }

//         if (xhr.status === 200) {
//             defaultOpions.success(responseText, xhr);
//         } else {
//             defaultOpions.error(responseText, xhr);
//         }
//     }

// }

// ajax({
//     type: 'post',
//     // 请求地址
//     url: 'http://localhost:3000/responseData',
//     success: function (data) {
//         console.log('这里是success函数');
//         console.log(data)
//     }
// })


function ajax(options) {
    // 默认选项
    const defaultOpions = {
        type: 'get',
        url: '',
        data: {},
        headers: {
            contentType: 'application/x-www-form-urlencoded'
        },
        success: function() {},
        error: function() {}
    }

    
    options = {...defaultOpions, ...options};

    // 拼接请求的参数
    let params = Object.keys(options.data).reduce((prev, key) => {
        prev += `${key}=${options.data[key]}&`;
        return prev;
    }, '');
    // 去除掉最后的&符号
    params = params.slice(0, params.length - 1);

    // 创建AJAX对象
    const xhr = new XMLHttpRequest();

    // get请求要在传入的url后拼接params
    const url = options.type === 'get' ? `${options.url}?${params}` : options.url;

    // 配置AJAX对象
    xhr.open(options.type, url);

    // 如果请求方式是post， 则要根据传入的headers，设置当前请求头Content-Type，告知服务器请求类型，才能获取数据
    if (options.type === 'post') {
        const contentType = options.headers.contentType;
        xhr.setRequestHeader('Content-Type', contentType);

        // 类型为json
        if (contentType === 'application/json') {
            xhr.send(JSON.stringify(options.data));
        } else { 
            // 如果是非json，则想服务器端传递普通类型的请求参数
            xhr.send(params);
        }
    } else {
        // 发送请求
        xhr.send();
    }

    // 监听xhr的onload方法，当xhr接收完响应数据后触发
   xhr.onload = function () {
    // 获取响应头中的Content-Type来解析响应数据
    const contentType = xhr.getResponseHeader('Content-Type');
    // 响应数据
    let responseText = xhr.responseText;

    // 如果是json，要转换为对象
    if (contentType.includes('application/json')) {
        responseText = JSON.parse(responseText);
    }

    // 如果状态码在200与400之间，则是请求成功
    if (xhr.status >= 200 && xhr.status < 400) {
        // 请求成功，调用处理成功的回调
        options.success(responseText, xhr);
    } else {
        // 请求失败，调用处理失败的回调
        options.error(responseText, xhr);
    }
   }

}

