const { gql } = require("graphql-tag");
const { createClient } = require("./client");

const query = gql`
  query TestQuery {
    people {
      id
      name
    }
  }
`;

module.exports = (app) => {
  app.get("/test", async (req, res, next) => {
    const client = createClient("https://example.com/graphql");

    const result = await client.query({
      query: query,
      context: {
        serverRequest: req,
        serverResponse: res
      }
    });

    res.write(JSON.stringify(result.data));
    res.end();
  });
};
