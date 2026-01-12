import axios from 'axios';
import { HiggsfieldConfig, QueueResponse, CompletionResponse } from '../types/higgsfield';

const BASE_URL = 'https://platform.higgsfield.ai';

// Helper to create headers based on user input
const getHeaders = (config: HiggsfieldConfig) => {
  return {
    'Content-Type': 'application/json',
    'hf-api-key': config.apiKey,
    'hf-secret': config.apiSecret,
  };
};

export const startGeneration = async (
  config: HiggsfieldConfig,
  imageUrl: string
): Promise<QueueResponse> => {
  const payload = {
    prompt: "Transform the provided photograph into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition, subjects, and layout exactly, but render everything with his signature swirling impasto brushstrokes, thick textured paint application, and a dramatic color palette of deep blues, turbulent yellows, and starry highlights. Emphasize vibrant, expressive post-impressionist energy while keeping fine details recognizable",
    image_urls: [imageUrl],
    num_images: 1,
    resolution: "1k",
    aspect_ratio: "4:3",
    output_format: "png"
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/nano-banana-pro/edit`,
      payload,
      { headers: getHeaders(config) }
    );
    return response.data;
  } catch (error) {
    console.error('Error starting generation:', error);
    throw error;
  }
};

export const checkStatus = async (
  config: HiggsfieldConfig,
  requestId: string
): Promise<CompletionResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/requests/${requestId}/status`,
      { headers: getHeaders(config) }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking status:', error);
    throw error;
  }
};
