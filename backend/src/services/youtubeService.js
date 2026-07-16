const axios = require("axios");

async function searchVideos(query, maxResults = 10) {
  const url = "https://www.googleapis.com/youtube/v3/search";

  const { data } = await axios.get(url, {
    params: {
      key: process.env.YOUTUBE_API_KEY,
      part: "snippet",
      q: "electric car OR EV car OR electric vehicle India",
      type: "video",
      maxResults
    }
  });

  return data.items;
}

module.exports = { searchVideos };