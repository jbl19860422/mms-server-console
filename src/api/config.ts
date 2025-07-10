//设置请求头（如果请求头统一的话可以在axios文件设置，则无须从这里传过去）
const header = {
    Accept: 'application/json;charset=UTF-8',
}

const getBaseUrl = () => {
    if (import.meta.env.MODE === 'development') {
        return 'http://192.168.172.128:8080'
    }

    const protocol = window.location.protocol;
    const hostAndPort = window.location.host;
    return protocol + "//" + hostAndPort;
};

const serverIp = '192.168.172.128';

export default {header, getBaseUrl, serverIp};