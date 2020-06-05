const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
app.use(express.json());

const fetchData = async (url) => {
  const result = await axios.get(url);
  return result.data;
};

app.get('/villagers', async (request, response) => {
  const getVillagersFromStardewValleyWiki = async () => {
    let villagers = [];
    const content = await fetchData('https://stardewvalleywiki.com/Villagers');
    const $ = cheerio.load(content);

    $('li.gallerybox').each((index, element) => {
      const title = $(element).find('.gallerytext > p > a').text();
      const avatar = 'https://stardewvalleywiki.com' + $(element).find('.thumb > div > a > img').attr('src');
      const link = 'https://stardewvalleywiki.com' + $(element).find('.gallerytext > p > a').attr('href');

      const villager = {
        title,
        avatar,
        link,
      };

      villagers.push(villager);
    });

    return villagers;
  };

  return response.json(await getVillagersFromStardewValleyWiki());
});

app.listen(3333, () => {
  console.log('Backend started');
});
