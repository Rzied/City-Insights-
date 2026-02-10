export type ApiError = {
  message: string;
  status?: number;
  code?: string;
};

export async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    let message = "Unexpected error";
    try {
      const data = (await response.json()) as { message?: string; error?: string };
      message = data.message ?? data.error ?? message;
    } catch {
      message = response.statusText || message;
    }
    const error: ApiError = { message, status: response.status };
    throw error;
  }
  return (await response.json()) as T;
}

export function missingKeyError(keyName: string): ApiError {
  return {
    message: `Missing API key. Configure ${keyName} in your .env file.`,
    code: "MISSING_KEY",
  };
}
