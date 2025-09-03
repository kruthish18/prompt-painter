import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid"; // Install this via npm install uuid

// this function handles the image generation request using Runware API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { characterName, description, style, imageAspectRatio } = req.body;

  if (!imageAspectRatio){
    return res.status(400).json({ message: "Missing image aspect ratio"});
  }

// Building the prompt string
  const prompt = `${characterName ? characterName + ", " : ""}${description}, ${style}, ultra-detailed, anime avatar, high quality`;
  // Parse width and height
  const [width, height] = imageAspectRatio.split("x").map(Number);

  const taskUUID = uuidv4();

  try {
    const apiRes = await fetch("https://api.runware.ai/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RUNWARE_API_KEY}`,
      },
      body: JSON.stringify([
        {
          taskType: "imageInference",
          taskUUID: taskUUID,
          positivePrompt: prompt,
          outputType: "URL",
          outputFormat: "JPG",
          deliveryMethod: "sync",
          model: "civitai:129218@141668", //MasterAnime v1
          width,
          height,
          steps: 30,
          CFGScale: 7.5,
          numberResults: 1
        }
      ]),
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.text();
      console.error("Runware API error response:", errorData);
      return res.status(500).json({ message: "Runware API failed", error: errorData });
    }

    const data = await apiRes.json();

    const imageUrl = data?.data?.[0]?.imageURL;
    if (!imageUrl) {
      return res.status(500).json({ message: "No image returned from API" });
    }

    return res.status(200).json({
        imageUrl: data.data[0].imageURL, 
        taskUUID: data.data[0].taskUUID,
        imageUUID: data.data[0].imageUUID,
    });
  } catch (error) {
    console.error("Internal error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}
