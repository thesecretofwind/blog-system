function ajaxPromise(options) {
    const defaultOpions = {
        url: '',
        type: 'get',
        data: {},
        headers: {
            'Content-Type': 'application/json'
        },
    };
    options = {...defaultOpions, ...options};
    let params = Object.keys(options.data).reduce( (prev, key) => {
        prev += `${key}=${options.data[key]}&`
    }, '');
    params = params.slice(0, params.length - 1);
    options.url = options.type === 'get' ? `${options.url}?${params}` : options.url;
    const xhr = new XMLHttpRequest();
    xhr.open(options.type, options.url);
    
    Object.keys(options.headers).forEach(name => {
        xhr.setRequestHeader(name, options.headers[name]);
    });


    return new Promise( (resolve, reject) => {
       if (options.type === 'post') {
           if(options.headers['Content-Type'] === 'application/json') {
                xhr.send(JSON.stringify(options.data));
           } else {
                xhr.send(params);
           }
       } else {
            xhr.send();
       }

       xhr.onload = function() {
            let repsonseText = xhr.repsonseText;
            const responseType = xhr.getResponseHeader('Content-type');

            if (responseType.includes('application/json')) {
                repsonseText = JSON.parse(repsonseText);
            }

            if (xhr.status >= 200 && xhr < 400) {
                resolve(repsonseText, xhr)
            } else {
                reject(repsonseText, xhr);
            }
       }
    })
}