"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

var _expressGraphql = _interopRequireDefault(require("express-graphql"));

var fs = _interopRequireWildcard(require("fs"));

var _graphql = require("graphql");

var _utilities = require("graphql/utilities");

var _schema = _interopRequireDefault(require("./core/schema"));

var _mongoDbUrl = _interopRequireDefault(require("./mongoDbUrl"));

var UserApp = _interopRequireWildcard(require("ptz-user-app"));

var UserRepository = _interopRequireWildcard(require("ptz-user-repository"));

var _ptzLogFile = _interopRequireDefault(require("ptz-log-file"));

var createGraphqlSchema = function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(schema) {
    var json, file;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _graphql.graphql)(schema, _utilities.introspectionQuery);

          case 2:
            json = _context.sent;
            file = '/public/schema.json';
            fs.writeFile(".".concat(file), JSON.stringify(json, null, 2), function (err) {
              if (err) throw err;
              log('Json schema created!', getRunningUrl(file));
            });
            app.use('/public', _express.default.static('public'));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createGraphqlSchema(_x) {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var _this = this, _arguments = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(_this, _arguments); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

_dotenv.default.config();

var log = (0, _ptzLogFile.default)({
  dir: './logs'
});
var app = (0, _express.default)();
app.use((0, _cors.default)());
log('starting server');
var PORT = 3011;

function getRunningUrl(path) {
  return "http://localhost:".concat(PORT).concat(path);
}

_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2() {
  var userApp, schema, graphqlFolder;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.t0 = UserApp;
          _context2.next = 4;
          return UserRepository.createUserRepository(_mongoDbUrl.default, 'minesweeper');

        case 4:
          _context2.t1 = _context2.sent;
          _context2.t2 = log;
          _context2.t3 = {
            userRepository: _context2.t1,
            log: _context2.t2
          };
          userApp = _context2.t0.createApp.call(_context2.t0, _context2.t3);
          _context2.next = 10;
          return userApp.seed(null);

        case 10:
          schema = (0, _schema.default)(userApp, log);
          graphqlFolder = '/graphql';
          app.use(graphqlFolder, (0, _expressGraphql.default)({
            schema: schema,
            graphiql: true
          }));
          _context2.next = 15;
          return createGraphqlSchema(schema);

        case 15:
          app.listen(PORT, function () {
            var url = getRunningUrl(graphqlFolder);
            log("Running on ".concat(url));
          });
          _context2.next = 21;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t4 = _context2["catch"](0);
          log(_context2.t4);

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, this, [[0, 18]]);
}))(); //# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map