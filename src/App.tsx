import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { clearToken, getToken } from "@/features/auth";
import { configureApi } from "@/lib/api";
import { API_URL } from "./config";
import { createQueryClient } from "./queryClient";
import { createAppRouter } from "./router";

function createApp() {
  const queryClient = createQueryClient();
  const router = createAppRouter({ queryClient });
  configureApi({
    baseUrl: API_URL,
    getToken,
    onUnauthorized: () => {
      clearToken();
      queryClient.clear();
      void router.navigate({ to: "/login", replace: true });
    },
  });
  return { queryClient, router };
}

function App() {
  const [{ queryClient, router }] = useState(createApp);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
