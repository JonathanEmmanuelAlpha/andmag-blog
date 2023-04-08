import dashify from "dashify";
import { format } from "date-fns";
import fs from "fs";
import { domainName } from "../components/links/AwesomeLink.type";
import { articlesCollection, profilesCollection } from "../libs/database";

export default async function generateSitemap() {
  const snaps = await articlesCollection
    .where("published", "==", true)
    .orderBy("createAt", "desc")
    .get();
  const articles = snaps.docs;

  const pSnaps = await profilesCollection.orderBy("createAt", "asc").get();
  const profiles = pSnaps.docs;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${domainName}/</loc>
            <lastmod>2023-03-10</lastmod>
        </url>
        <url>
            <loc>${domainName}/contact</loc>
            <lastmod>2023-03-10</lastmod>
        </url>
        <url>
            <loc>${domainName}/faq</loc>
            <lastmod>2023-03-10</lastmod>
        </url>
        <url>
            <loc>${domainName}/account/login</loc>
            <lastmod>2023-03-09</lastmod>
        </url>
        <url>
            <loc>${domainName}/account/register</loc>
            <lastmod>2023-03-09</lastmod>
        </url>
        <url>
            <loc>${domainName}/account/login-with-email-link</loc>
            <lastmod>2023-03-09</lastmod>
        </url>
        ${articles
          .map((article) => {
            return `<url>
                <loc>${domainName}/articles/${dashify(article.data().title, {
              condense: true,
            })}-${article.id}</loc>
                <lastmod>${format(
                  new Date(
                    article.data().updateAt
                      ? article.data().updateAt.seconds * 1000
                      : article.data().createAt.seconds * 1000
                  ),
                  "yyyy-MM-dd"
                )}</lastmod>
            </url>`;
          })
          .join("")}
          ${profiles
            .map((profile) => {
              return `<url>
                  <loc>${domainName}/account/profile?pseudo=${
                profile.data().pseudo
              }</loc>
                  <lastmod>${format(
                    new Date(
                      profile.data().updateAt
                        ? profile.data().updateAt.seconds * 1000
                        : profile.data().createAt.seconds * 1000
                    ),
                    "yyyy-MM-dd"
                  )}</lastmod>
              </url>`;
            })
            .join("")}
    </urlset>`;

  fs.writeFileSync("./public/sitemap.xml", xml);
}
