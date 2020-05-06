"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseAPI_1 = require("./baseAPI");
class LicenseAPI extends baseAPI_1.BaseAPI {
    getAllLicenses(orgId, projects) {
        const filters = {};
        if (projects !== undefined) {
            filters['projects'] = [projects];
        }
        return LicenseAPI.requestEngine.request('/org/' + orgId + '/licenses', 'POST', {
            'filters': filters,
        }).then((res) => {
            const results = res.body.results;
            return results;
        });
    }
}
exports.LicenseAPI = LicenseAPI;
//# sourceMappingURL=licenses.js.map