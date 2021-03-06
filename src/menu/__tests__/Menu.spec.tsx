import harness from '@dojo/framework/testing/harness';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import { tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';

import ActiveLink from '../../link/ActiveLink';

import * as css from '../Menu.m.css';
import Menu, { MenuLinkProperties } from '../Menu';
import Dropdown from '../../dropdown/Dropdown';

describe('Menu', () => {
	const links: MenuLinkProperties[] = [
		{
			label: 'Link 1',
			to: 'outlet',
			params: {
				param: 'value'
			}
		},
		{
			label: 'Link 2',
			to: 'outlet2'
		}
	];

	const subLinks: MenuLinkProperties[] = [
		{
			label: 'Sub Link 1',
			to: 'outlet3',
			params: {
				param: 'value3'
			}
		},
		{
			label: 'Sub Link 2',
			to: 'outlet4'
		}
	];

	const baseAssertion = assertionTemplate(() => (
		<div assertion-key="root" classes={css.side}>
			{menu({ links })}
		</div>
	));

	interface MenuOptions {
		type?: 'main' | 'sub';
		links?: MenuLinkProperties[];
		activeName?: RenderResult;
		children?: RenderResult;
	}

	const menu = (options?: MenuOptions) => {
		const { type = 'main', links = [], activeName = '', children = [] } = options || {};
		return [
			<nav classes={[css.menu, css[type]]}>
				{activeName && <Dropdown activeName={activeName} items={links} />}
				<ul classes={css.menuList}>
					{links.map((link) => {
						const { label, ...props } = link;
						return (
							<li classes={css.menuItem}>
								<ActiveLink classes={css.menuLink} activeClasses={[css.selected]} {...props}>
									{label}
								</ActiveLink>
							</li>
						);
					})}
				</ul>
				{children}
			</nav>
		];
	};

	const children = () => [
		<a href="url/to/somewhere" target="_blank" rel="noopener noreferrer" aria-label={`Github Link`}>
			<svg style="fill: white;" height="28px" viewBox="0 0 16 16" version="1.1" width="28" aria-hidden="true">
				<path
					fill-rule="evenodd"
					d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
				></path>
			</svg>
		</a>
	];

	it('renders menu with left style desktop menu', () => {
		const h = harness(() => <Menu desktopStyle="side" links={links} />);

		h.expect(baseAssertion);
	});

	it('renders menu with left style desktop menu and sub menu', () => {
		const h = harness(() => <Menu desktopStyle="side" links={links} subLinks={subLinks} />);

		h.expect(
			baseAssertion.setChildren('~root', () => [...menu({ links }), ...menu({ type: 'sub', links: subLinks })])
		);
	});

	it('renders menu with dropdown style desktop menu', () => {
		const h = harness(() => <Menu desktopStyle="dropdown" activeName="Name" links={links} />);

		h.expect(
			baseAssertion
				.setChildren('~root', () => menu({ links, activeName: 'Name' }))
				.setProperty('~root', 'classes', 'dropdown')
		);
	});

	it('renders menu with dropdown style desktop menu and sub menu', () => {
		const h = harness(() => (
			<Menu
				desktopStyle="dropdown"
				links={links}
				activeName="Name"
				subLinks={subLinks}
				subActiveName="Sub Name"
			/>
		));

		h.expect(
			baseAssertion
				.setChildren('~root', () => [
					...menu({ links, activeName: 'Name' }),
					...menu({ type: 'sub', links: subLinks, activeName: 'Sub Name' })
				])
				.setProperty('~root', 'classes', 'dropdown')
		);
	});

	it('renders menu with dropdown style desktop menu with children', () => {
		const h = harness(() => (
			<Menu desktopStyle="dropdown" activeName="Name" links={links}>
				{children()}
			</Menu>
		));

		h.expect(
			baseAssertion
				.setChildren('~root', () => menu({ links, activeName: 'Name', children: children() }))
				.setProperty('~root', 'classes', 'dropdown')
		);
	});

	it('renders menu with dropdown style desktop menu and sub menu with children', () => {
		const h = harness(() => (
			<Menu desktopStyle="dropdown" activeName="Name" links={links} subLinks={subLinks} subActiveName="Sub Name">
				{children()}
			</Menu>
		));

		h.expect(
			baseAssertion
				.setChildren('~root', () => [
					...menu({ links, activeName: 'Name' }),
					...menu({ type: 'sub', links: subLinks, activeName: 'Sub Name', children: children() })
				])
				.setProperty('~root', 'classes', 'dropdown')
		);
	});
});
