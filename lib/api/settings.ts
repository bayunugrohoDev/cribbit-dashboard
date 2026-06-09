export interface SystemSetting {
  key: string;
  value: string;
  description: string | null;
  is_secret: boolean;
  updated_at: string;
}

export const fetchSettings = async (): Promise<SystemSetting[]> => {
  const response = await fetch("/api/settings");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const updateSettings = async (
  settings: { key: string; value: string }[]
): Promise<{ success: boolean }> => {
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ settings }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update settings");
  }

  return response.json();
};
