/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const pkgName = 'svgIconsAutocomplete';

function activate(context) {
	function setup() {
		const filter = vscode.workspace.getConfiguration().get(`${pkgName}.extFilter`);
		return vscode.languages.registerCompletionItemProvider(
			'*',
			{
				provideCompletionItems() {
					return fs
						.readdirSync(
							path.resolve(
								vscode.workspace.rootPath,
								vscode.workspace.getConfiguration().get(`${pkgName}.watchFolder`)
							) //, 'assets', 'sprite', 'svg', 'icons')
						)
						.filter(filename => filter === '*' || filename.endsWith(filter))
						.map(filename => new vscode.CompletionItem(filename));
				}
			},
			'/'
		);
	}

	let provider1 = setup();
	let provider2 = vscode.workspace.onDidChangeConfiguration(e => {
		if (
			e.affectsConfiguration(`${pkgName}.watchFolder`) ||
			e.affectsConfiguration(`${pkgName}.extFilter`)
		) {
			provider1.dispose();
			provider1 = setup();
		}
	});

	context.subscriptions.push(provider1, provider2);
}

module.exports = { activate };
