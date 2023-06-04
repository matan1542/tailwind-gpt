import * as vscode from 'vscode';
import { Chatbot } from './llm';
import * as beautify from 'js-beautify'

let hoverContent = '';

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
					console.log('hereee123');
					
					const prompt = `
					The following is a classlist. Some of the classes in the class list might be 
					a Tailwind CSS classes. Please provide explanations for each class.
					For example, given the following class list:
					"absolute grid pt-2"
					Please return the following output:
					"
					<p><strong>Raw CSS</strong></p>
					<pre><code> 
					{
					position: absolute;
					display: grid;
					padding-top: 8px;
					}
					</code></pre>

					<p><strong>Explanation:</strong></p>
					<ul>
					<li><code>absolute</code> - Sets the <code>position: absolute</code> attribute on the element.</li>
					<li><code>grid</code> - Sets the <code>display: grid</code> attribute on the element.</li>
					<li><code>pt-2</code> - Sets the <code>padding-top: 8px</code> attribute on the element (1 unit equals to 4px by default in Tailwind CSS).</li>
					</ul>
					"

					CLASS LIST: "${classList.join(' ')}" 
					ANSWER:
					`
					// Just a simple example on valid html
					// const value = `<p><strong>Raw CSS</strong></p><pre><code>{position:relative;display:flex;padding-top:24px;}</code></pre><p><strong>Explanation:</strong></p><ul><li><code>relative</code>-Sets the<code>position:relative</code>attribute on the element.</li><li><code>flex</code>-Sets the<code>display:flex</code>attribute on the element.</li><li><code>pt-6</code>-Sets the<code>padding-top:24px</code>attribute on the element (1 unit in Tailwind CSS equals 4px by default, so<code>pt-6</code>corresponds to<code>6*4px=24px</code>).</li></ul>`
					const value = await chatBot.complete(prompt)
					
					const panel = vscode.window.createWebviewPanel(
						'tailWindClasses', // Unique identifier for the panel
						'TailWindCssClasses', // Title displayed in the UI
						vscode.ViewColumn.One, // Desired column for the panel
						{
							enableScripts: true // Enable JavaScript in the webview
						}
					);
					try {
						const valueFormatted = beautify.html_beautify(value as string);
						const content = new vscode.MarkdownString(valueFormatted);
						console.log('content', content);
						
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
			}

			return null;
		}
	});

	context.subscriptions.push(hoverProvider);
}
export function deactivate() { }

function verifyClassValidity(hoveredWord: string, classList: string[]) {
	return hoveredWord === 'className' || classList.join(' ').includes(hoveredWord)
}