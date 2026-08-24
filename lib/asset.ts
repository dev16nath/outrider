/**
 * Prefix a /public path with the deploy's basePath.
 *
 * Every /public reference goes through this, next/image included. That is not
 * belt-and-braces: with `unoptimized: true` next/image's default loader hands
 * the src straight back, basePath and all, so an <Image src="/assets/x.png">
 * ships pointing at the domain root and 404s on a project-repo deploy. Only
 * the framework's own /_next output gets basePath applied for free.
 *
 * Read from NEXT_PUBLIC_ so it is inlined at build time and works in the
 * client components too; it resolves to "" locally, leaving paths untouched.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  return `${BASE}${path}`;
}
