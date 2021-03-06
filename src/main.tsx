import renderer from '@dojo/framework/core/vdom';
import Registry from '@dojo/framework/core/Registry';
import { tsx } from '@dojo/framework/core/vdom';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import { StateHistory } from '@dojo/framework/routing/history/StateHistory';

import Alert from './content/Alert';
import Aside from './content/Aside';
import CodeBlock from './code/CodeBlock';
import CodeSandbox from './code/CodeSandbox';
import BlogImage from './image/Image';

import routes from './routes';
import App from './App';

const registry = new Registry();

const router = registerRouterInjector(routes, registry, { HistoryManager: StateHistory });

registry.define('docs-alert', Alert);
registry.define('docs-aside', Aside);
registry.define('docs-codeblock', CodeBlock);
registry.define('docs-codesandbox', CodeSandbox);
registry.define('docs-blogimage', BlogImage);

const r = renderer(() => <App />);
const domNode = document.getElementById('root') as HTMLElement;
r.mount({ registry, domNode });

router.on('nav', () => scroll(0, 0));
