const fetch = require("node-fetch");

async function query({ query, variables }) {
  const result = await fetch(process.env.HASURA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  }).then((response) => response.json());

  //TODO show helpful info if there is an error
  console.log("result.error", result);

  return result.data;
}

exports.query = query;
