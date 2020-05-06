"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const projects_1 = require("./projects");
const orgs_1 = require("./orgs");
const baseAPI_1 = require("./baseAPI");
const licenses_1 = require("./licenses");
const dependency_1 = require("./dependency");
class Api {
    constructor(base, token) {
        baseAPI_1.BaseAPI.init(base, token);
        this.project = new projects_1.ProjectAPI();
        this.org = new orgs_1.OrgAPI();
        this.license = new licenses_1.LicenseAPI();
        this.dependency = new dependency_1.DepAPI();
    }
}
exports.Api = Api;
//# sourceMappingURL=index.js.map