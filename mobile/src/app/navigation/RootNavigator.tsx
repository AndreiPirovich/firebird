import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DetailsScreen} from '../../features/posts/screens/DetailsScreen';
import {PostsScreen} from '../../features/posts/screens/PostsScreen';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Posts"
          component={PostsScreen}
          options={{title: 'PostsScreen'}}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{title: 'DetailsScreen'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
