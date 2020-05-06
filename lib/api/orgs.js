"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseAPI_1 = require("./baseAPI");
class OrgAPI extends baseAPI_1.BaseAPI {
    getAllOrgs() {
        return OrgAPI.requestEngine.request('/orgs', 'GET').then((res) => {
            const results = res.body.orgs;
            return results;
        });
    }
}
exports.OrgAPI = OrgAPI;
//# sourceMappingURL=orgs.js.map