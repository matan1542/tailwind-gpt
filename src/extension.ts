import * as vscode from 'vscode';
import * as beautify from 'js-beautify'
import { Chatbot } from './llm';
import { createPrompt, handleStream } from './utils';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "tailwind-gpt" is now active!');
	const chatBot = new Chatbot()

	let disposable = vscode.commands.registerCommand('tailwind-gpt.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from tailwind-gpt!');
	});

	context.subscriptions.push(disposable);

	// Register a hover provider for JSX, TSX, and JS files
	const hoverProvider = vscode.languages.registerHoverProvider([
		{ scheme: 'file', language: 'javascript' },
		{ scheme: 'file', language: 'typescript' },
		{ scheme: 'file', language: 'javascriptreact' },
		{ scheme: 'file', language: 'typescriptreact' }
	], {
		async provideHover(document: vscode.TextDocument, position: vscode.Position) {
			const wordRange = document.getWordRangeAtPosition(position);
			const line = document.lineAt(position.line).text;
			const hoveredWord = document.getText(wordRange)

			// Extract the class names from the line using regular expressions
			const classNames = line.match(/className=['"]([^'"]+)['"]/);
			if (classNames && (classNames.length > 1)) {
				const classList = classNames[1].split(/\s+/)
				if (verifyClassValidity(hoveredWord, classList)) {
					const prompt = createPrompt(classList)
					// Just a simple example on valid html
					// const value = `<p><strong>Raw CSS</strong></p><pre><code>{position:relative;display:flex;padding-top:24px;}</code></pre><p><strong>Explanation:</strong></p><ul><li><code>relative</code>-Sets the<code>position:relative</code>attribute on the element.</li><li><code>flex</code>-Sets the<code>display:flex</code>attribute on the element.</li><li><code>pt-6</code>-Sets the<code>padding-top:24px</code>attribute on the element (1 unit in Tailwind CSS equals 4px by default, so<code>pt-6</code>corresponds to<code>6*4px=24px</code>).</li></ul>`
					const panel = vscode.window.createWebviewPanel(
						'tailWindClasses', // Unique identifier for the panel
						'TailwindCSSClasses', // Title displayed in the UI
						vscode.ViewColumn.One, // Desired column for the panel
						{
							enableScripts: true // Enable JavaScript in the webview
						}
					);
					const streamHandler = handleStream()
					const stream = await chatBot.complete(prompt)
					const decoder = new TextDecoder('utf-8');
					stream.on('data', (value: any) => {
						streamHandler.stream(value, decoder, panel)
					})
				}
			}
			return null;
		}
	});

	context.subscriptions.push(hoverProvider);
}

export function verifyClassValidity(hoveredWord: string, classList: string[]) {
	return hoveredWord === 'className' || classList.join(' ').includes(hoveredWord)
}

export function displayGPTAnswerFormated(resText: string, panel: vscode.WebviewPanel) {
	try {
		// Sanitize the formatted HTML content
		const content = new vscode.MarkdownString(resText);
		// Function to send a message to the panel
		function sendMessageToPanel(message: vscode.MarkdownString) {
			panel.webview.html = message.value;
		}

		// Example usage: Write to the panel
		sendMessageToPanel(content);
	} catch (err) {
		console.log('err', err);
	}
}