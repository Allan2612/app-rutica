import { StyleSheet, Dimensions, Platform } from "react-native";
import { spacing, typography } from "@/styles/theme";

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const MAX_WIDTH = isWeb ? 500 : width - 48;
const IMAGE_WIDTH = Math.min(width - 96, MAX_WIDTH);

export const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    ...(isWeb && { alignItems: "center" }),
    
  },
  headerRow: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
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
  cardWrapper: {
    width: IMAGE_WIDTH,
  },
});
