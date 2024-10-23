import dashify from "dashify";
import { format } from "date-fns";
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
    </urlset>`;

  return xml;
}
