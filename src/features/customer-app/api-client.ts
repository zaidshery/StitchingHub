export type ApiFailure = {
  success: false;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export async function postJson<TResponse>(
  url: string,
  body: Record<string, unknown>,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(body),
    ...init,
  });

  const payload = (await response.json().catch(() => null)) as
    | { success: true; data: TResponse }
    | ApiFailure
    | null;

  if (!response.ok || !payload || !payload.success) {
    const message = payload && "error" in payload ? payload.error?.message : undefined;
    throw new Error(message ?? "Request failed");
  }

  return payload.data;
}