import { apiClient } from '../client';

export interface AISuggestionRequest {
  title: string;
}

export interface AISuggestionResponse {
  description: string;
}

export const aiService = {
  async getSuggestion(title: string): Promise<string> {
    const response = await apiClient.post<AISuggestionResponse>('/ai/suggest', {
      title,
    });
    return response.data.description;
  },
};