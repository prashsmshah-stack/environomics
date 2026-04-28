import { createContext, useContext, useMemo } from "react";

const PublicContentContext = createContext({
  content: null,
  status: "success",
  error: "",
  refresh: async () => {},
});

export function PublicContentProvider({ children }) {
  const value = useMemo(
    () => ({
      content: null,
      status: "success",
      error: "",
      refresh: async () => {},
    }),
    []
  );

  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
}

export function usePublicContent() {
  return useContext(PublicContentContext);
}
