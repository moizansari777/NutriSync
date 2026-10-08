// Local stand-in for crash reporting. The app has no error-tracking service of
// its own yet, so these only log in development; wire a real reporter in here
// later and every call site picks it up.

type Context = Record<string, unknown> | undefined;

export const captureException = (error: unknown, context?: Context) => {
  if (__DEV__) {
    console.warn("[error]", error, context ?? "");
  }
};

export const captureMessage = (message: string, context?: Context) => {
  if (__DEV__) {
    console.warn("[message]", message, context ?? "");
  }
};

export const addBreadcrumb = (_breadcrumb: Record<string, unknown>) => {};
