export interface HiggsfieldConfig {
  apiKey: string;
  apiSecret: string;
}

export interface GenerationRequest {
  image_urls: string[];
  num_images: number;
  resolution: string;
  aspect_ratio: string;
  output_format: string;
  prompt: string;
}

export interface QueueResponse {
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'nsfw';
  request_id: string;
  status_url: string;
  cancel_url: string;
  message?: string;
}

export interface CompletionResponse extends QueueResponse {
  images?: { url: string }[];
  video?: { url: string };
}
