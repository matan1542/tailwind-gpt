import { Configuration, OpenAIApi } from "openai";
import * as vscode from "vscode";
import { getConfigName } from "./utils";

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

export class Chatbot {
  private client: OpenAIApi;
  constructor() {
    const configuration = new Configuration({
      apiKey: getAPIToken(),
    });
    this.client = new OpenAIApi(configuration);
  }

  async complete(prompt: string) {
    try {
      const completion = await this.client.createCompletion({
        model: "gpt-3.5-turbo",
        prompt,
      });
      return completion.data.choices[0].text;
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
