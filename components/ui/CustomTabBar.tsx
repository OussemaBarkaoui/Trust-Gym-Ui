import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { createShadow } from "@/utils/platformStyles";

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const CustomTabBar: React.FC<TabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: state.index,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [state.index]);

  const getIcon = (routeName: string, focused: boolean) => {
    let iconName: keyof typeof Ionicons.glyphMap;

    switch (routeName) {
      case "DashBoardScreen":
        iconName = focused ? "home" : "home-outline";
        break;
      case "TransactionsScreen":
        iconName = focused ? "receipt" : "receipt-outline";
        break;
      case "WalletScreen":
        iconName = focused ? "wallet" : "wallet-outline";
        break;
      default:
        iconName = "home";
    }

    return iconName;
  };

  const getTitle = (routeName: string) => {
    switch (routeName) {
      case "DashBoardScreen":
        return "Dashboard";
      case "TransactionsScreen":
        return "Transactions";
      case "WalletScreen":
        return "Wallet";
      default:
        return routeName;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  {
                    transform: [
                      {
                        scale: isFocused ? 1.1 : 1,
                      },
                    ],
                  },
                ]}
              >
                <Ionicons
                  name={getIcon(route.name, isFocused)}
                  size={24}
                  color={isFocused ? "#1a1a1a" : "#666"}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? "#1a1a1a" : "#666" },
                  ]}
                >
                  {getTitle(route.name)}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    ...createShadow("#000", { width: 0, height: -2 }, 0.1, 4, 8),
  },
  tabBar: {
    flexDirection: "row",
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
