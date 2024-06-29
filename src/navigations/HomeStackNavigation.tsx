import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MovieDetail from '../screens/MovieDetail'
import Home from '../screens/Home'

const Stack = createNativeStackNavigator()

const HomeStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"Home"}
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={"MovieDetail"}
        component={MovieDetail}
      />
    </Stack.Navigator>
  )
}

export default HomeStackNavigation