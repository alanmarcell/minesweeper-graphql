"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = exports.default = void 0;

var _graphql = require("graphql");

function AppSchema(_ref) {
  var log = _ref.log;
  var appType = new _graphql.GraphQLObjectType({
    name: 'App',
    fields: function fields() {
      return {
        title: {
          type: _graphql.GraphQLString
        },
        subTitle: {
          type: _graphql.GraphQLString
        }
      };
    }
  });
  return {
    appType: appType
  };
}

var _default = AppSchema;
exports.default = _default;
var app = {
  title: 'Polutz',
  subTitle: 'Framework or Boilerplate?'
}; //# sourceMappingURL=appSchema.js.map

exports.app = app;
//# sourceMappingURL=appSchema.js.map