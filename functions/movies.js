const { URL } = require("url");
const fetch = require("node-fetch");
const { query } = require("./util/harusa");
// const movies = require("../data/movies.json");

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}
exports.handler = async () => {
  const api = new URL("https://www.omdbapi.com");

  api.searchParams.set("apikey", process.env.OMDB_API_KEY);
  console.log("OMDB_API_KEY", process.env.OMDB_API_KEY);

  const { movies } = await query({
    query: `
  query MyQuery {
    movies {
      id
      poster
      tagline
    }
  }
`,
  });

  const promises = movies.map((movie) => {
    api.searchParams.set("i", movie.id);
    return fetch(api)
      .then((response) => response.json())
      .then((data) => {
        const scores = data.Ratings;
        console.log("data", data);
        console.log("score", scores);
        return {
          ...movie,
          scores,
        };
      });
  });
  // https://www.learnwithjason.dev/blog/keep-async-await-from-blocking-execution/
  const moviesWithRatings = await Promise.all(promises);
  console.log("moviesWithRatings", JSON.stringify(moviesWithRatings));

  return {
    statusCode: 200,
    body: JSON.stringify(moviesWithRatings),
  };
};
