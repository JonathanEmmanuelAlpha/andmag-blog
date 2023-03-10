import fs from "fs";
import dashify from "dashify";
import { format } from "date-fns";
import { domainName } from "../components/links/AwesomeLink.type";
import { articlesCollection } from "../libs/database";

export default function GenerateSitemap() {
  return null;
}

export async function getServerSideProps(ctx) {
  ctx.res.setHeader("Content-Type", "text/xml");

  const xml = await generateSitemap();
  fs.writeFileSync("./public/sitemap.xml", xml);

  ctx.res.write(xml);
  ctx.res.end(0);

  return {
    props: {},
  };
}

async function generateSitemap() {
  const snaps = await articlesCollection.orderBy("createAt", "desc").get();
  const articles = snaps.docs;

  return `<?xml version="1.0" encoding="UTF-8"?>
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
                            <loc>${domainName}/articles/${dashify(
                  article.data().title
                )}-${article.id}</loc>
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
            </urlset>`;
}
