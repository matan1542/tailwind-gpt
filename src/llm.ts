import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as vscode from "vscode";
import { getConfigName } from "./utils";
import { OPEN_AI_API_URL } from './constants';

// Retrieve the OpenAI API token from the IDE settings
function getAPIToken() {
  const ideConfig = vscode.workspace.getConfiguration();
  const apiToken = ideConfig.get<string>(getConfigName("apiToken"));

  if (!apiToken) {
    throw new Error(
      "OpenAI API token not found. Please set it in the settings."
    );
  }
  return apiToken;
}

export interface ChatbotInterface {
  client: AxiosInstance;
  complete(prompt: string): Promise<any>;
}

export class Chatbot implements ChatbotInterface {
  public client: AxiosInstance;
  constructor() {
    const apiToken = getAPIToken()

    // Create an instance of Axios with the base URL, response type, and authorization header
    const instance = axios.create({
      baseURL: OPEN_AI_API_URL,
      responseType: 'stream',
      headers: { Authorization: `Bearer ${apiToken}` }
    })
    this.client = instance;
  }

  // Method to generate a completion using the OpenAI API
  async complete(prompt: string) {
    try {
      const response = await this.client.post('', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        stream: true // For streaming responses
      })
      console.log('response', response);

      return response.data // Return the entire response stream
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      return null;
    }
  }
}
