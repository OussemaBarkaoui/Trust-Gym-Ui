import { useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { useSession } from "../contexts/SessionContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!session.isLoading) {
      const inAuthGroup = segments[0] === "(auth)";

      if (!session.isAuthenticated && !inAuthGroup) {
        // User is not authenticated and not in auth group - redirect to login
        router.replace("/(auth)/LoginScreen");
      } else if (session.isAuthenticated && inAuthGroup) {
        // User is authenticated but in auth group - redirect to dashboard
        router.replace("/(tabs)/DashBoardScreen");
      }
    }
  }, [session.isAuthenticated, session.isLoading, segments]);

  return <>{children}</>;
}
