import prettier from 'prettier/standalone';
import babylon from 'prettier/parser-babel';
const { ReactParser } = require('../../templates/react/parser');

// TODO: Look if this can be placed globally
const codeFormatter = (code) =>
	prettier.format(code, {
		parser: 'babel',
		plugins: [babylon],
	});

// TODO: Place the below output code in a different file for better tests visibility
const outputForDep = `
	import ReactDOM from 'react-dom';
	import React from 'react';
	import Dep from 'dep';

	const App = () => (
		<React.Fragment>
			<Dep />
		</React.Fragment>
	);

	ReactDOM.render(<App />, document.getElementById("root"));
`;

const outputForNoDep = `
	import ReactDOM from 'react-dom';
	import React from 'react';

	const App = () => (
		<React.Fragment>
			<div>
				<h1>Hello World!</h1>
			</div>
		</React.Fragment>
	);

	ReactDOM.render(<App />, document.getElementById("root"));
`;

const outputForImportedAssets = `
	import ReactDOM from 'react-dom';
	import React from 'react';
	import Dep from 'dep';
	import config from 'dep/lib/config'
	import enus from 'dep/lib/locale/en_US'
	import 'dep/assets/index.css';

	const App = () => (
		<React.Fragment>
			<Dep />
		</React.Fragment>
	);

	ReactDOM.render(<App />, document.getElementById("root"));
`;

const outputForExplicitComponent = `
		import ReactDOM from 'react-dom';
		import React from 'react';

		const ExplicitCounter = () => {
			return (
				<React.Fragment>
					<h2>Hello Test</h2>
				</React.Fragment>
			);
		}

		ReactDOM.render(<ExplicitCounter />, document.getElementById("root"));
`;

const outputForImplicitComponent = `
		import ReactDOM from 'react-dom';
		import React from 'react';

		const Counter = () =>  (
			<React.Fragment>
				<h2>Hello Test</h2>
			</React.Fragment>
		);

		ReactDOM.render(<Counter />, document.getElementById("root"));

`;

const outputForCommonJS = `
	const React = require('react');
	const ReactDOM = require('react-dom');
	const Dep = require('dep');

	const App = () => (
		<React.Fragment>
			<Dep />
		</React.Fragment>
	)

	ReactDOM.render(<App />, document.getElementById('root'));
`;

const outputForMixedImport = `
	import React from 'react';
	const ReactDOM = require('react-dom');
	const Dep = require('dep');

	const App = () => (
		<React.Fragment>
			<Dep />
		</React.Fragment>
	);

	ReactDOM.render(<App />, document.getElementById("root"));
`;

const outputForExportedComponent = `
	import ReactDOM from 'react-dom';
	import React from 'react';
	import Dep from 'dep';

	const App = () => (
		<Dep.Provider>
			<Dep.UI />
		</Dep.Provider>
	);

	ReactDOM.render(<App />, document.getElementById("root"));
`;

const outputForDirectRender = `
	import { render } from 'react-dom'
	import React from 'react'
	import  Dep from 'dep'

	render(<Dep />, document.getElementById("app"))
`;

// TODO: Create the instance once and use it in different test cases
describe('JSX Expression with Dependency', () => {
	test('with only Dependency import', () => {
		const code = `
			import Dep from 'dep';

			<Dep />
		`;

		const instance = new ReactParser(code);
		return expect(codeFormatter(outputForDep)).toEqual(codeFormatter(instance.code));
	});

	test('with React import', () => {
		const code = `
			import React from 'react';
			import Dep from 'dep';

			<Dep />
		`;

		const instance = new ReactParser(code);
		return expect(codeFormatter(outputForDep)).toEqual(codeFormatter(instance.code));
	});

	test('with React and ReactDOM imports', () => {
		const code = `
			import ReactDOM from 'react-dom';
			import React from 'react';
			import Dep from 'dep';

			<Dep />
		`;

		const instance = new ReactParser(code);

		return expect(codeFormatter(outputForDep)).toEqual(codeFormatter(instance.code));
	});

	test('Import build files, locales and styles', () => {
		const code = `
			import Dep from 'dep';
			import config from 'dep/lib/config'
			import enus from 'dep/lib/locale/en_US'
			import 'dep/assets/index.css';

			<Dep />
		`;

		const instance = new ReactParser(code);

		return expect(codeFormatter(outputForImportedAssets)).toEqual(codeFormatter(instance.code));
	});
});

describe('No Dependencies', () => {
	test('JSX Expression', () => {
		const code = `
			<div>
				<h1>Hello World!</h1>
			</div>
		`;

		const instance = new ReactParser(code);

		return expect(codeFormatter(outputForNoDep)).toEqual(codeFormatter(instance.code));
	});
});

describe('Functional (Arrow-fun) Component Defined', () => {
	test('with Implicit Return', () => {
		const code = `
			const Counter = () =>  (
				<React.Fragment>
					<h2>Hello Test</h2>
				</React.Fragment>
			);
		`;

		const instance = new ReactParser(code);

		return expect(codeFormatter(outputForImplicitComponent)).toEqual(
			codeFormatter(instance.code),
		);
	});

	test('with Explicit Return', () => {
		const code = `
			const ExplicitCounter = () =>  {
				return (
					<React.Fragment>
						<h2>Hello Test</h2>
					</React.Fragment>
				);
			};
		`;

		const instance = new ReactParser(code);

		return expect(codeFormatter(outputForExplicitComponent)).toEqual(
			codeFormatter(instance.code),
		);
	});
});

describe('Mixed Imports', () => {
	test('with all CommonJS Import', () => {
		const code = `
			const React = require("react");
			const ReactDOM = require("react-dom");
			const Dep = require('dep');

			<Dep />
		`;

		const instance = new ReactParser(code);

		return expect(codeFormatter(outputForCommonJS)).toEqual(codeFormatter(instance.code));
	});

	test('with different Imports', () => {
		const code = `
			const ReactDOM = require("react-dom");
			const Dep = require('dep');

			<Dep />
		`;

		const instance = new ReactParser(code);

		return expect(codeFormatter(outputForMixedImport)).toEqual(codeFormatter(instance.code));
	});
});

describe('Exported Component', () => {
	test('Basic', () => {
		const code = `
			import Dep from 'dep';

			export default () => (
				<Dep.Provider>
					<Dep.UI />
				</Dep.Provider>
			)
		`;

		const instance = new ReactParser(code);

		return expect(codeFormatter(outputForExportedComponent)).toEqual(
			codeFormatter(instance.code),
		);
	});
});

describe('Full App (with DOM Rendering)', () => {
	test('Named render import', () => {
		const code = `
			import { render } from 'react-dom'
			import React from 'react'
			import  Dep from 'dep'

			render(<Dep />, document.getElementById("app"))
		`;
		const instance = new ReactParser(code);

		return expect(codeFormatter(outputForDirectRender)).toEqual(codeFormatter(instance.code));
	});
});
