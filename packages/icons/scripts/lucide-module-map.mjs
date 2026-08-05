const BARREL_EXPORT_PATTERN = /export \{([^}]*)\} from '\.\/(icons\/[^']+)\.mjs';/g;
const ALIAS_PATTERN = /default as ([A-Za-z0-9_]+)/g;

export function buildIconModuleMap(barrelSource) {
  const moduleByAlias = new Map();

  for (const [, aliasList, modulePath] of barrelSource.matchAll(BARREL_EXPORT_PATTERN)) {
    for (const [, alias] of aliasList.matchAll(ALIAS_PATTERN)) {
      moduleByAlias.set(alias, modulePath);
    }
  }

  return moduleByAlias;
}

export function resolveIconModules(barrelSource, iconNames) {
  const moduleByAlias = buildIconModuleMap(barrelSource);
  const unresolved = iconNames.filter((name) => !moduleByAlias.has(name));

  if (unresolved.length > 0) {
    throw new Error(
      `these icon names are not exported by the installed lucide build: ${unresolved.join(", ")}`,
    );
  }

  return iconNames.map((name) => ({ name, modulePath: moduleByAlias.get(name) }));
}
