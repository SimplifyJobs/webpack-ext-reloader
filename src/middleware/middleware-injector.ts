import { Compilation } from 'webpack';
import { ConcatSource } from 'webpack-sources';
import middleWareSourceBuilder from './middleware-source-builder';

const middlewareInjector: MiddlewareInjector = ({ background, contentScript, extensionPage }, { port, reloadPage }) => {
  const middlewareSource = middleWareSourceBuilder({ port, reloadPage });

  const matchBgOrContentOrPage = (name: string) =>
    name === background ||
    name === contentScript ||
    (contentScript && contentScript.includes(name)) ||
    name === extensionPage ||
    (extensionPage && extensionPage.includes(name));

  return (assets, chunks: Compilation['chunks']) =>
    Array.from(chunks).reduce((prev, { name, files }) => {
      if (matchBgOrContentOrPage(name as string)) {
        files.forEach((entryPoint) => {
          if (/\.js$/.test(entryPoint)) {
            prev[entryPoint] = new ConcatSource(middlewareSource, assets[entryPoint]);
          }
        });
      }
      return prev;
    }, {});
};

export default middlewareInjector;
