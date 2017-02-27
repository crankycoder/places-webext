const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;

Cu.import("resource://gre/modules/PlacesUtils.jsm", this);
Cu.import("resource://services-common/async.js");

function QueryStore() {
}

QueryStore.prototype = {
    _stmts: {},
    _getStmt(query) {
        if (query in this._stmts) {
            return this._stmts[query];
        }

        let db = PlacesUtils.history.QueryInterface(Ci.nsPIPlacesDatabase)
            .DBConnection;
        this._stmts[query] = db.createAsyncStatement(query);
        return this._stmts[query];
    },
    runQuery(query) {
        return Async.querySpinningly(this._getStmt(query), ["counter"]);
    }
};

class API extends ExtensionAPI {
  getAPI(context) {
    return {
      hello: {
        async hello(query) {
            let qs = new QueryStore();
            var result = qs.runQuery(query.query);
            return result;
        }
      }
    };
  }
}
