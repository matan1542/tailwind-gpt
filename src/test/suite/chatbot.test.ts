import chai from 'chai';
const expect = chai.expect;
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Chatbot, ChatbotInterface } from '../../llm';
import { OPEN_AI_API_URL } from '../../constants';
import streamMock from '../../_mocks_/streamMock';
import { after, beforeEach, describe, it } from 'mocha';

// Create a new instance of the Axios mock adapter
const mockAxios = new MockAdapter(axios);


// // Mock the response for axios.get(URL_STATES)

describe('ChatBot', () => {
    let chatBot = new Chatbot();
    console.log('chatBot', chatBot);

    // after(() => {
    //     // Restore the original method after the test suite
    // });
    it('should complete a prompt successfully', async () => {
        const prompt = 'Hello, chat bot!';
        mockAxios.onPost(OPEN_AI_API_URL, {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            stream: true // For streaming responses
        }).reply(200, streamMock);
        const response = await chatBot.complete(prompt);
        console.log('response123', response);

        // Verify the response from the complete method
        // expect(response).ok
    });
});
