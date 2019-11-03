import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import ConvertScreen from '../screens/ConvertScreen';
import IdentifyScreen from '../screens/IdentifyScreen';
import InterpretScreen from '../screens/InterpretScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const ConvertStack = createStackNavigator(
  {
    Convert: ConvertScreen
  },
  config
);

ConvertStack.navigationOptions = {
  tabBarLabel: 'Convert',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

ConvertStack.path = '';

const IdentifyStack = createStackNavigator(
  {
    Identify: IdentifyScreen,
  },
  config
);

IdentifyStack.navigationOptions = {
  tabBarLabel: 'Identify',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

IdentifyStack.path = '';

const InterpretStack = createStackNavigator(
  {
    Interpret: InterpretScreen,
  },
  config
);

InterpretStack.navigationOptions = {
  tabBarLabel: 'Interpret',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

InterpretStack.path = '';

const tabNavigator = createBottomTabNavigator({
  ConvertStack,
  IdentifyStack,
  InterpretStack,
});

tabNavigator.path = '';

export default tabNavigator;
