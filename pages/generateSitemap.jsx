import generateSitemap from "../helpers/generateSitemap";

export default function GenerateSitemap() {
  return null;
}

export async function getServerSideProps(ctx) {
  try {
    await generateSitemap();
  } catch (error) {
    console.log("GENERATION ERROR: ", error);
  }

  return {
    props: {},
  };
}
