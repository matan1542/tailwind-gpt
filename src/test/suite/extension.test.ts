import * as assert from 'assert';

import * as vscode from 'vscode';
import { displayGPTAnswerFormated, verifyClassValidity } from '../../extension';
import { describe, it } from 'mocha';
import sinon from 'sinon'

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	describe('verifyClassValidity', () => {
		it('should return true if hovered word is "className"', () => {
			const classList = ['class1', 'class2', 'class3'];
			const hoveredWord = 'className';
			const result = verifyClassValidity(hoveredWord, classList);
			assert.strictEqual(result, true);
		});

		it('should return true if hovered word is included in class list', () => {
			const classList = ['class1', 'class2', 'class3'];
			const hoveredWord = 'class2';
			const result = verifyClassValidity(hoveredWord, classList);
			assert.strictEqual(result, true);
		});

		it('should return false if hovered word is not found in class list', () => {
			const classList = ['class1', 'class2', 'class3'];
			const hoveredWord = 'class4';
			const result = verifyClassValidity(hoveredWord, classList);
			assert.strictEqual(result, false);
		});
	});

	describe('displayGPTAnswerFormated', () => {
		it('should send formatted HTML content to the panel', () => {
			const panel = { webview: { html: '' } }
			const resText = '<p>Formatted HTML content</p>';
			displayGPTAnswerFormated(resText, panel as any);
			assert.strictEqual(panel.webview.html, resText);
		});
	});

});
