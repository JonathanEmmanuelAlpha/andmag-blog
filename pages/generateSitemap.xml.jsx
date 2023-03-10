import generateSitemap from "../helpers/generateSitemap";

export default function GenerateSitemap() {
  return null;
}

export async function getServerSideProps(ctx) {
  ctx.res.setHeader("Content-Type", "text/xml");

  const xml = await generateSitemap();
  ctx.res.write(xml);
  ctx.res.end(0);

  return {
    props: {},
  };
}
