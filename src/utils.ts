import { WebviewPanel } from "vscode";
import { EXTENSION_NAME } from "./constants";
import { displayGPTAnswerFormated } from "./extension";

export function getConfigName(name: string) {
	return `${EXTENSION_NAME}.${name}`;
}

export function handleStream() {
	let resText = ''
	return ({
		stream: (value: BufferSource, decoder: TextDecoder, panel: WebviewPanel) => {
			const chunk = decoder.decode(value)
			const lines: string[] = chunk.split("\n");
			const parsedLines = lines
				.map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
				.filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
				.map((line) => JSON.parse(line)); // Parse the JSON string

			for (const parsedLine of parsedLines) {
				const { choices } = parsedLine;
				const { delta } = choices[0];
				const { content } = delta;
				// Accumulate the content
				if (content) {
					resText += content
					displayGPTAnswerFormated(resText, panel)
				}
			}
		}
	})
}

export function createPrompt(classList: string[]) {
	return `
					The following is a classlist. Some of the classes in the class list might be 
					a Tailwind CSS classes. Please provide explanations for each class.
					For color classes such as tahiti that equals to '#3ab7bf' please be implicit,
					and return in hexadecimal
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
}

