import { setupServer } from "msw/node";
import { rest } from "msw";

/*
const handlers = [
    rest.get("/api/repositories", (req, res, ctx) => {
      const language = req.url.searchParams.get("q").split("language:")[1];
      console.log(language);
      return res(
        ctx.json({
          items: [
            { id: 1, full_name: `${language}_one` },
            { id: 2, full_name: `${language}_two` },
          ],
        })
      );
    }),
  ];
  
  // call setupServer with spread '...' handlers
  const server = setupServer(...handlers);
  
  beforeAll(() => {
    server.listen();
  });
  
  afterEach(() => {
    server.resetHandlers();
  });
  
  afterAll(() => {
    server.close();
  });
  */

/**
 * Creates a mock server for testing with simplified configuration
 * @param {Array} handlerConfig - Array of route configurations
 * @param {string} handlerConfig[].method - HTTP method (defaults to "get")
 * @param {string} handlerConfig[].path - URL path to mock
 * @param {Function} handlerConfig[].res - Callback that returns the response data
 */
export function createServer(handlerConfig) {
  // Transform config objects into MSW rest handlers
  const handlers = handlerConfig.map((config) => {
    // Use provided method or default to "get"
    return rest[config.method || "get"](config.path, (req, res, ctx) => {
      // Automatically wrap the response in ctx.json()
      return res(ctx.json(config.res(req, res, ctx)));
    });
  });

  // Create server instance with all handlers
  const server = setupServer(...handlers);

  // Set up test lifecycle hooks
  beforeAll(() => {
    server.listen(); // Start listening before all tests
  });

  afterEach(() => {
    server.resetHandlers(); // Reset handlers after each test
  });

  afterAll(() => {
    server.close(); // Clean up after all tests complete
  });
}

/**
 * ex of usage:
 *  createServer([
 *   {
 *     path: "/api/repositories",
 *     res: (req, res, ctx) => {
 *       const language = req.url.searchParams.get("q").split("language:")[1];
 *       return {
 *         items: [
 *           { id: 1, full_name: `${language}_one` },
 *           { id: 2, full_name: `${language}_two` },
 *         ],
 *       };
 *     },
 *   },
 * ]);
 */
