import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';

const require = createRequire(import.meta.url);

/**
 * Invariant: our declared peer range for a tool must be a SUBSET of every
 * bundled dependency's peer range for that tool. If our range allows a version
 * the dependency does not, the package lies about what it supports — which is
 * exactly how consumers hit ERESOLVE (eslint) or a runtime crash (typescript).
 *
 * This ia a curated carrier list, not a full-closure walk — just our direct
 * dependencies. The typescript ceiling is carried by `typescript-eslint`, which
 * declares the peer directly. Add a carrier here if a future dep introduces a
 * peer we bundle that isn't already one of our direct dependencies.
 */

const ownPkg = require('../package.json') as {
  peerDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
};

const ownPeers = ownPkg.peerDependencies ?? {};
const carriers = Object.keys(ownPkg.dependencies ?? {});
const TOOLS = ['eslint', 'typescript'] as const;

/**
 * Read a dependency's package.json, tolerating packages that don't export it.
 */
const readPkg = (
  name: string
): { peerDependencies?: Record<string, string> } | null => {
  try {
    return require(`${name}/package.json`);
  } catch {
    /**
     * not exported — fall through to resolve+walk
     */
  }
  try {
    let dir = path.dirname(require.resolve(name));

    for (let i = 0; i < 8 && dir !== path.dirname(dir); i++) {
      const p = path.join(dir, 'package.json');

      if (fs.existsSync(p)) {
        const j = JSON.parse(fs.readFileSync(p, 'utf8'));

        if (j.name === name) {
          return j;
        }
      }

      dir = path.dirname(dir);
    }
  } catch {
    /* not installed */
  }

  return null;
};

const checkedTools = new Set<string>();

for (const name of carriers) {
  const pkg = readPkg(name);

  /**
   * dep uninstalled or package.json unreadable
   */
  if (!pkg) {
    continue;
  }

  const peers = pkg.peerDependencies ?? {};

  for (const tool of TOOLS) {
    const ourRange = ownPeers[tool];
    const depRange = peers[tool];

    if (!ourRange || !depRange) {
      continue;
    }

    checkedTools.add(tool);

    test(`${tool}: our peer "${ourRange}" ⊆ ${name} "${depRange}"`, () => {
      assert.ok(
        semver.subset(ourRange, depRange, { includePrerelease: true }),
        `our ${tool} peer "${ourRange}" allows versions outside ${name}'s "${depRange}"`
      );
    });
  }
}

/**
 * Guard against a vacuous green tick: every tool's invariant must have run for at
 * least one carrier. A global counter would let one tool silently go unchecked
 * (e.g. if the typescript peer moves out of a direct dep) while CI stays green.
 */
for (const tool of TOOLS) {
  test(`${tool} invariant was exercised by at least one carrier`, () => {
    assert.ok(
      checkedTools.has(tool),
      `no carrier declared a ${tool} peer — invariant never exercised`
    );
  });
}
