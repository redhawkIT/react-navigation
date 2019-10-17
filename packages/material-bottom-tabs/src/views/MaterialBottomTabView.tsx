import * as React from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabNavigationState, TabActions } from '@react-navigation/routers';

import {
  MaterialBottomTabDescriptorMap,
  MaterialBottomTabNavigationConfig,
  MaterialBottomTabNavigationHelpers,
} from '../types';

type Props = MaterialBottomTabNavigationConfig & {
  state: TabNavigationState;
  navigation: MaterialBottomTabNavigationHelpers;
  descriptors: MaterialBottomTabDescriptorMap;
};

type Scene = { route: { key: string } };

export default class MaterialBottomTabView extends React.PureComponent<Props> {
  private getColor = ({ route }: Scene) => {
    return this.props.descriptors[route.key].options.tabBarColor;
  };

  private getBadge = ({ route }: Scene) => {
    return this.props.descriptors[route.key].options.tabBarBadge;
  };

  private getLabelText = ({ route }: Scene) => {
    const { options } = this.props.descriptors[route.key];

    return options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : typeof options.title === 'string'
      ? options.title
      : ((route as any) as { name: string }).name;
  };

  private getAccessibilityLabel = ({ route }: Scene) => {
    const { descriptors, state } = this.props;
    const { options } = descriptors[route.key];

    if (typeof options.tabBarAccessibilityLabel !== 'undefined') {
      return options.tabBarAccessibilityLabel;
    }

    const label = this.getLabelText({ route });

    if (typeof label === 'string') {
      return `${label}, tab, ${state.routes.findIndex(
        r => r.key === route.key
      ) + 1} of ${state.routes.length}`;
    }

    return undefined;
  };

  private getTestID = ({ route }: Scene) => {
    return this.props.descriptors[route.key].options.tabBarTestID;
  };

  private handleTabPress = ({ route }: Scene) => {
    const { navigation } = this.props;

    navigation.emit({
      type: 'tabPress',
      target: route.key,
    });
  };

  private renderIcon = ({
    route,
    focused,
    color,
  }: {
    route: { key: string };
    focused: boolean;
    color: string;
  }) => {
    const { options } = this.props.descriptors[route.key];

    if (typeof options.tabBarIcon === 'string') {
      return (
        <MaterialCommunityIcons
          name={options.tabBarIcon}
          color={color}
          size={24}
          style={styles.icon}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        />
      );
    }

    if (typeof options.tabBarIcon === 'function') {
      return options.tabBarIcon({ focused, color });
    }

    return null;
  };

  render() {
    const { state, navigation, descriptors, ...rest } = this.props;

    return (
      <BottomNavigation
        {...rest}
        navigationState={state}
        onIndexChange={(index: number) =>
          navigation.dispatch({
            ...TabActions.jumpTo(state.routes[index].name),
            target: state.key,
          })
        }
        renderScene={({ route }) => descriptors[route.key].render()}
        renderIcon={this.renderIcon}
        getLabelText={this.getLabelText}
        getColor={this.getColor}
        getBadge={this.getBadge}
        getAccessibilityLabel={this.getAccessibilityLabel}
        getTestID={this.getTestID}
        onTabPress={this.handleTabPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
