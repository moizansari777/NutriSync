type ErrorResponse = {
  status?: number | string;
  error?: string;
  errors?: string[];
  data?: any;
};

export const getError = (error: ErrorResponse | unknown): string => {
  if (typeof error === "object" && error !== null) {
    const err = error as ErrorResponse;

    if (
      typeof err.data === "string" &&
      err?.data?.startsWith("<!DOCTYPE html>")
    ) {
      return "We couldn't complete your request. Please try again in a few minutes";
    }

    // Case 1: Network error
    if (
      err.status === "FETCH_ERROR" &&
      typeof err.error === "string" &&
      err.error.includes("Network request failed")
    ) {
      return "Internet connection strength insufficient, please check your connection and try again.";
    }

    if (typeof err.data?.message === "string") {
      return err.data.message;
    }

    // Case 2: Nested API error message
    if (typeof err.data?.error === "string") {
      return err.data.error;
    }

    // Case 3: Nested API validation errors (your case)
    if (Array.isArray(err.data?.errors) && err.data.errors.length > 0) {
      return err.data.errors[0];
    }

    // Case 4: Top-level errors (fallback)
    if (Array.isArray(err.errors) && err.errors.length > 0) {
      return err.errors[0];
    }
  }

  return "Something went wrong. Please try again in a few moments.";
};
