import { assert } from 'chai';
import defaultOptions from '../src/utils/default-options';
import resolveOptions from '../src/utils/resolve-options';

describe('resolveOptions', () => {
  const defaultsSnapshot = JSON.parse(JSON.stringify(defaultOptions));

  afterEach(() => {
    assert.deepEqual(defaultOptions, defaultsSnapshot, 'default options must never be mutated');
  });

  it('Should return the defaults when no options are given', () => {
    assert.deepEqual(resolveOptions(), defaultsSnapshot);
  });

  it('Should not leak the port or entries of one instance into another', () => {
    const first = resolveOptions({
      port: 9091,
      entries: { contentScript: ['cs-a', 'cs-b', 'cs-c'] },
    } as any);
    const second = resolveOptions({ entries: { contentScript: ['cs-x'] } } as any);

    assert.equal(first.port, 9091);
    assert.deepEqual(first.entries.contentScript, ['cs-a', 'cs-b', 'cs-c']);
    assert.equal(second.port, defaultsSnapshot.port);
    assert.deepEqual(second.entries.contentScript, ['cs-x']);
  });

  it('Should resolve to plain defaults after another instance set custom options', () => {
    resolveOptions({ port: 9999, reloadPage: false } as any);
    const resolved = resolveOptions();

    assert.equal(resolved.port, defaultsSnapshot.port);
    assert.equal(resolved.reloadPage, defaultsSnapshot.reloadPage);
  });
});
