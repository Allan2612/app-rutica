import { StyleSheet, Platform } from "react-native";
import { spacing, typography } from "@/styles/theme";

const isWeb = Platform.OS === "web";

export const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    ...(isWeb && { alignItems: "center" }),
  },
  headerRow: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: -0.3,
  },
  countText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
});
