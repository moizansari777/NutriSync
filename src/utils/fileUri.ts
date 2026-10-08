import * as RNFS from "@dr.pogodin/react-native-fs";

/**
 * Vision Camera hands back plain filesystem paths ("/data/user/0/...", see
 * `PhotoFile.filePath`), while the native image decoder and the multipart
 * upload layer expect a `file://` URL. Android is strict about this and will
 * either throw or upload an empty body when the scheme is missing, which is a
 * silent, device-specific failure.
 *
 * These helpers make the two forms explicit so a path is never double-prefixed
 * and never sent without a scheme.
 */

const FILE_SCHEME = /^file:\/\//i;
// Any other scheme (content://, ph://, http://) must be passed through
// untouched - prefixing those would corrupt them.
const FOREIGN_SCHEME = /^(?!file:)[a-z][a-z0-9+.-]*:\/\//i;

/** Normalises to exactly one `file://` prefix. Safe to call repeatedly. */
export const toFileUri = (path?: string | null): string => {
  if (!path) return "";
  if (FOREIGN_SCHEME.test(path)) return path;
  return `file://${path.replace(FILE_SCHEME, "")}`;
};

/** Strips the `file://` prefix, for APIs that need a raw filesystem path. */
export const toFilePath = (path?: string | null): string => {
  if (!path) return "";
  if (FOREIGN_SCHEME.test(path)) return path;
  return path.replace(FILE_SCHEME, "");
};

/**
 * Fire-and-forget delete for our own temporary files. Returns nothing and can
 * never throw or reject, so it is safe to call from a `finally` block or from
 * an unmount cleanup where awaiting is not possible.
 */
export const deleteFileQuietly = (path?: string | null): void => {
  const target = toFilePath(path);
  // Only ever remove real files we created; foreign schemes point at content
  // we do not own (e.g. the user's gallery).
  if (!target || FOREIGN_SCHEME.test(target)) return;

  RNFS.unlink(target).catch(() => {
    // Already gone, or not removable - nothing useful to do either way.
  });
};
