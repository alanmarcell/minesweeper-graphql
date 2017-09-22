"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _menuSchema = _interopRequireDefault(require("../menus/menuSchema"));

var _userSchema = _interopRequireDefault(require("../users/userSchema"));

var _appSchema = _interopRequireDefault(require("./appSchema"));

var _graphql = require("graphql");

var _graphqlRelay = require("graphql-relay");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Schema(userApp, log) {
  var appSchema = (0, _appSchema.default)({
    log: log
  });
  var menuSchema = (0, _menuSchema.default)({
    log: log
  });
  var userSchema = (0, _userSchema.default)({
    userApp: userApp,
    log: log
  });
  var viewer = {};
  var viewerType = new _graphql.GraphQLObjectType({
    name: 'Viewer',
    fields: function fields() {
      return {
        id: (0, _graphqlRelay.globalIdField)('Viewer'),
        app: {
          type: appSchema.appType,
          resolve: function resolve() {
            return _appSchema.app;
          }
        },
        menu: {
          type: menuSchema.menuType,
          resolve: function resolve() {
            return _menuSchema.menu;
          }
        },
        userConnection: userSchema.getUserConnection()
      };
    }
  });
  var outputViewer = {
    type: viewerType,
    resolve: function resolve() {
      return viewer;
    }
  };
  var schema = new _graphql.GraphQLSchema({
    query: new _graphql.GraphQLObjectType({
      name: 'Query',
      fields: function fields() {
        return {
          viewer: {
            type: viewerType,
            resolve: function resolve() {
              return viewer;
            }
          }
        };
      }
    }),
    mutation: new _graphql.GraphQLObjectType({
      name: 'Mutation',
      fields: function fields() {
        return {
          saveUser: userSchema.getSaveUserMutation(outputViewer),
          getAuthToken: userSchema.getAuthTokenMutation(outputViewer)
        };
      }
    })
  });
  return schema;
}

var _default = Schema; //# sourceMappingURL=schema.js.map

exports.default = _default;
//# sourceMappingURL=schema.js.map