import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(400).send();

  const file = await fs.readFile("./public/datasets/carsData.json", {
    encoding: "utf-8",
  });

  return res.status(200).json({ data: JSON.parse(file) });
}
