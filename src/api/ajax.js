import axios from 'axios'
import Qs from 'qs'


export default function ajax(url, data = {}, type = 'GET') {

    return new Promise(function (resolve, reject) {
        let promise
        if (type === 'GET') {
            // 准备url query参数数据
            let dataStr = '' //数据拼接字符串
            Object.keys(data).forEach(key => {
                dataStr += key + '=' + data[key] + '&'
            })
            if (dataStr !== '') {
                dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
                url = url + '?' + dataStr
            }
            // 发送get请求
            promise = axios.get(url, { headers: { 'token': window.localStorage.getItem('token') } });
        } else {
            // 发送post请求
            data = Qs.stringify(data);
            promise = axios.post(url, data, { headers: { 'token': window.localStorage.getItem('token'), 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } });
        }

        promise.then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            reject(error)
        })
    })
}