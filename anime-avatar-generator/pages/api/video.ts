import { NextApiRequest, NextApiResponse } from 'next';

// this handler function handles the video generation request using Runware API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // allows only POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, taskUUID, videoAspectRatio } = req.body;

    if (!prompt || !taskUUID || !videoAspectRatio) {
        console.log("🚨 Missing fields:", { prompt, taskUUID, videoAspectRatio });
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const [width, height] = videoAspectRatio.split("x").map(Number);
    const RUNWARE_API_KEY = process.env.RUNWARE_API_KEY;

    const requestBody = {
        taskType: "videoInference",
        taskUUID,
        model: "bytedance:2@1", // Seedance 1.0 Pro
        positivePrompt: prompt,
        duration: 5,
        width,
        height,
        outputType: "URL",
        outputFormat: "MP4",
        outputQuality: 95,
        numberResults: 1,
        includeCost: true,
        deliveryMethod: "sync",
        frameImages: [
            {
                inputImage: req.body.inputImage,
                frame: "first"
            }
        ],
        providerSettings: {
            bytedance: {
                cameraFixed: true
            }
        }
    };

    try {
        const apiRes = await fetch('https://api.runware.ai/v1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RUNWARE_API_KEY}`,
            },
            body: JSON.stringify([requestBody]),
        });

        const data = await apiRes.json();

        console.log("🎥 Runware video response:", data);

        const videoUrl = data?.data?.[0]?.videoURL;
        if (!videoUrl) {
            return res.status(500).json({ error: 'No video returned from API' });
        }

        return res.status(200).json({
            videoUrl,
        });
    } catch (error) {
        console.error("Runware Video Error:", error);
        return res.status(500).json({ error: 'Runware video API failed' });
    }
}
