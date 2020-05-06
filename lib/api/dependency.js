"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseAPI_1 = require("./baseAPI");
class DepAPI extends baseAPI_1.BaseAPI {
    getAllDependencies(orgId, projects) {
        const filters = {};
        if (projects !== undefined) {
            filters['projects'] = [projects];
        }
        // https://snyk.io/api/v1/org/orgId/dependencies?sortBy=dependency&order=asc&page=1&perPage=20
        return DepAPI.requestEngine.request('/org/' + orgId + '/dependencies?perPage=2000', 'POST', {
            'filters': filters,
        }).then((res) => {
            const results = res.body.results;
            return [results, res.body.total];
        });
    }
}
exports.DepAPI = DepAPI;
//# sourceMappingURL=dependency.js.map