import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, videoAspectRatio, inputImage } = req.body;

    // Basic input check
    if (!prompt || !videoAspectRatio || !inputImage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Derive size and a stable id for this job
    const [width, height] = videoAspectRatio.split('x').map(Number);
    const taskUUID = uuidv4();

    // Payload expected by Runware for video generation
    const requestBody = {
        taskType: 'videoInference',
        taskUUID,
        model: 'bytedance:2@1',
        positivePrompt: prompt,
        duration: 5,
        width,
        height,
        outputType: 'URL',
        outputFormat: 'MP4',
        outputQuality: 95,
        numberResults: 1,
        deliveryMethod: 'sync',
        frameImages: [
            {
                inputImage,
                frame: 'first',
            },
        ],
        providerSettings: {
            bytedance: {
                cameraFixed: true,
            },
        },
    };

    try {
        const runwareRes = await fetch('https://api.runware.ai/v1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.RUNWARE_API_KEY}`,
            },
            body: JSON.stringify([requestBody]),
        });

        // Bubble up provider errors so the UI can show them
        if (!runwareRes.ok) {
            const txt = await runwareRes.text();
            return res.status(502).json({ error: 'Runware error', details: txt });
        }

        const result = await runwareRes.json();
        const videoUrl = result?.data?.[0]?.videoURL ?? null;

        // Predictable CDN fallback derived from the task id
        const fallbackUrl = `https://vm.runware.ai/video/ws/2/vi/${taskUUID}.mp4`;

        console.log('Runware video response (trimmed):', {
            taskUUID,
            hasVideoUrl: !!videoUrl,
        });

        return res.status(200).json({
            videoUrl,       
            fallbackUrl,    // often becomes playable within a few seconds
            taskUUID,
            status: videoUrl ? 'ready' : 'processing',
        });
    } catch (error) {
        console.error('Video generation error:', error);
        return res.status(500).json({ error: 'Failed to generate video' });
    }
}