/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

module.exports.bootstrap = async function (done) {
  sails.after("hook:http:loaded", () => {
    const swaggerPath = path.resolve(__dirname, "../docs/swagger.yaml");
    const swaggerDocument = YAML.load(swaggerPath);

    // Động hoá servers dựa trên environment
    const currentPort = process.env.PORT || sails.config.port || 1337;
    const productionUrl =
      process.env.PRODUCTION_API_URL || process.env.SWAGGER_SERVER_URL;

    swaggerDocument.servers = [
      {
        url: `http://localhost:${currentPort}/api/v1`,
        description: "Development server",
      },
    ];

    if (productionUrl) {
      swaggerDocument.servers.push({
        url: productionUrl,
        description: "Production server",
      });
    }

    if (process.env.NODE_ENV === "production" && productionUrl) {
      swaggerDocument.servers = [
        {
          url: productionUrl,
          description: "Production server",
        },
        {
          url: `http://localhost:${currentPort}/api/v1`,
          description: "Development server",
        },
      ];
    }

    sails.hooks.http.app.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );

    // Test route
    sails.hooks.http.app.get("/test", (req, res) =>
      res.send("Hello from bootstrap")
    );

    sails.log.info(" Swagger UI available at http://localhost:1337/docs");
  });

  return done();
};
