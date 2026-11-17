import { merge } from 'lodash';
import { IPluginOptions } from '../../typings/webpack-ext-reloader';
import defaultOptions from './default-options';

/**
 * Resolves the options of a single plugin instance.
 *
 * lodash's `merge` mutates its first argument, so it must never receive the
 * shared `defaultOptions` object directly: doing so would leak one instance's
 * options (port, entries, ...) into every instance created afterwards.
 * Merging into a fresh object keeps the defaults untouched.
 */
export default function resolveOptions(userOptions?: IPluginOptions) {
  return merge({}, defaultOptions, userOptions);
}
