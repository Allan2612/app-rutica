import { StyleSheet, Dimensions, Platform } from "react-native";
import { colors, spacing } from "@/styles/theme";

const isWeb = Platform.OS === "web";
const { width } = Dimensions.get("window");
const MAX_WIDTH = isWeb ? 500 : width - 48;
const CARD_WIDTH = Math.min(width - 96, MAX_WIDTH);

export const styles = StyleSheet.create({
  carouselContainer: {
    position: "relative",
    alignItems: "center",
  },
  cardContainer: {
    width: CARD_WIDTH,
    alignItems: "center",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  navButtonLeft: {
    left: spacing.md,
  },
  navButtonRight: {
    right: spacing.md,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
