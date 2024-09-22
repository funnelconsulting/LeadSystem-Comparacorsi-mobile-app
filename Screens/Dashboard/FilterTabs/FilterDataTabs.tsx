import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Lead from './Lead';
import Chat from './ChatTab';
import MInfor from './MInfor';

const Tab = createMaterialTopTabNavigator();
const FilterDataTabs = () => {
  return (
      <Tab.Navigator screenOptions={{headerShown:false, tabBarLabelStyle: { textTransform: 'none', fontWeight: '600', fontSize: 14}}}>
        <Tab.Screen name='Scheda Lead' component={Lead} />
        <Tab.Screen name='Info' component={MInfor} />
        <Tab.Screen name='Chat' component={Chat} />
      </Tab.Navigator>
  )
}

export default FilterDataTabs