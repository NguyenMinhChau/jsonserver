const jsonServer = require('json-server');
const url = require('url');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    req.body.updatedAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

// CUSTOM OUPUT
router.render = (req, res) => {
  // check GET pagination in json-serser
  const headers = res.getHeaders();
  const totalCountHeader = headers['x-total-count'];
  if (req.method === 'GET' && totalCountHeader) {
    const totalCount = parseInt(totalCountHeader, 10);
    const parsed = url.parse(req.url, true);
    const page = parseInt(parsed.query._page) || 1;
    const limit = parseInt(parsed.query._limit) || 10;
    const totalPages = Math.ceil(totalCount / limit);
    const result = {
      data: res.locals.data,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
    return res.jsonp(result);
  } else {
    return res.jsonp(res.locals.data);
  }
};

// Use default router
server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
