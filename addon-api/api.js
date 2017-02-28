const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;

Cu.import("resource://gre/modules/PlacesUtils.jsm", this);
Cu.import("resource://services-common/async.js");
Cu.import("resource://gre/modules/Services.jsm");

function QueryStore() {
    Services.obs.addObserver(() => {
        for (let query in this._stmts) {
            let stmt = this._stmts[query];
            stmt.finalize();
        }
        this._stmts = {};
    }, "places-shutdown", false);
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
    runQuery(query, params) {
        return Async.querySpinningly(this._getStmt(query), params);
    }
};

class API extends ExtensionAPI {
  getAPI(context) {
    return {
      hello: {
          async hello(jsonData) {

              let query = jsonData.query;
              let params = jsonData.params;
              let qs = new QueryStore();
              var result = qs.runQuery(query, params);
              return result;
        }
      }
    };
  }
}
