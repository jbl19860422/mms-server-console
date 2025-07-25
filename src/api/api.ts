//引入封装好的 service
import service from "./service";
import config from "./config";

//根据自身需求
const api = {
    async version(params) {
        const url = config.getBaseUrl() + "/api/version";
        return service.get(url, params, config.header);
    },
    async obj_count(params) {
        const url = config.getBaseUrl() + "/api/obj_count";
        return service.get(url, params, config.header);
    },
    async domain_apps(params) {
        const url = config.getBaseUrl() + '/api/domain_apps';
        return service.get(url, params, config.header);
    },
    async domain_streams(params) {
        const url = config.getBaseUrl() + '/api/domain_streams';
        return service.get(url, params, config.header);
    },
    async app_streams(params) {
        const url = config.getBaseUrl() + '/api/app_streams';
        return service.get(url, params, config.header);
    },
    async domain_recorders(params) {
        const url = config.getBaseUrl() + '/api/domain_recorders';
        return service.get(url, params, config.header);
    },
    async app_recorders(params) {
        const url = config.getBaseUrl() + '/api/app_recorders';
        return service.get(url, params, config.header);
    },
    async cut_off_stream(params) {
        const url = config.getBaseUrl() + '/api/cut_off_stream';
        return service.get(url, params, config.header);
    },
    async stop_recorder(params) {
        const url = config.getBaseUrl() + '/api/stop_recorder';
        return service.post(url, params, config.header);
    },
    async get_mem_info(params) {
        const url = config.getBaseUrl() + '/api/get_mem_info';
        return service.get(url, params, config.header);
    }
}

export default api