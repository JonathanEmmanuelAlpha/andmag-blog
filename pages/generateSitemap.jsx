import generateSitemap from "../helpers/generateSitemap";
import fs from "fs";

export default function GenerateSitemap() {
  return null;
}

export async function getServerSideProps(ctx) {
  try {
    const xml = await generateSitemap();
    fs.writeFileSync("./public/sitemap.xml", xml);
  } catch (error) {
    console.log("GENERATION ERROR: ", error);
  }

  return {
    props: {},
  };
}
