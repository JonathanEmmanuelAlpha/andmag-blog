import fs from "fs";
import { Feed } from "feed";
import { articlesCollection } from "../libs/database";
import dashify from "dashify";

export default async function generateRSSFeed() {
  const result = await articlesCollection.orderBy("createAt", "desc").get();
  const allArticles = result.docs;

  const site_url = "http://localhost:3000";

  const feedOptions = {
    copyright: `All rights reserved ${new Date().getFullYear()}, Andmag-ground`,
    id: site_url,
    title: "Andmag-ground",
    author: "Andmag-ground",
    description:
      "Speed, efficiency, performance and safety are our pride. Whatever the difficulty of your project, we promise you support that meets your expectations",
    link: site_url,
    image: `${site_url}/images/AG.png`,
    favicon: `${site_url}/favicon.ico`,
    generator: "Feed for Node.js",
    feedLinks: {
      rss2: `${site_url}/rss.xml`,
      json: `${site_url}/rss.json`,
      atom: `${site_url}/atom.xml`,
    },
  };

  const feed = new Feed(feedOptions);

  allArticles.forEach((article) => {
    feed.addItem({
      title: article.data().title,
      id: article.id,
      link: `${site_url}/articles/${dashify(article.data().title)}-${
        article.id
      }`,
      description: article.data().description,
      date: new Date(article.data().updateAt.seconds * 1000),
      author: article.data().blogName,
      copyright: `All rights reserved ${new Date(
        article.data().createAt.seconds * 1000
      ).getFullYear()}, ${article.data().blogName}`,
    });
  });

  fs.writeFileSync("./public/rss.xml", feed.rss2());
}
