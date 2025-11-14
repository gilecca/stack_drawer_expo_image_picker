import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import Ionicons from '@react-native-vector-icons/ionicons';
// Screens
import HomeScreen from '../screens/HomeScreen';
import GalleryScreen from '../screens/GalleryScreen';
import CameraScreen from '../screens/CameraScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ Componente do menu hambúrguer REUTILIZÁVEL
const HamburgerMenu = ({ navigation }: any) => (
  <TouchableOpacity 
    onPress={() => navigation.toggleDrawer()}
    style={{ marginLeft: 15, padding: 10 }}
  >
    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>☰</Text>
  </TouchableOpacity>
);

// ✅ Tipagem correta para as opções de tela
const getScreenOptions = (navigation: any, title: string): NativeStackNavigationOptions => ({
  title: title,
  headerLeft: () => <HamburgerMenu navigation={navigation} />,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
});

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // ✅ Header visível em TODAS as telas do Stack
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={({ navigation }) => 
          getScreenOptions(navigation, 'Início')
        }
      />
      <Stack.Screen 
        name="Gallery" 
        component={GalleryScreen}
        options={({ navigation }) => 
          getScreenOptions(navigation, 'Galeria de Fotos')
        }
      />
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen}
        options={({ navigation }) => 
          getScreenOptions(navigation, 'Câmera')
        }
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false, // ✅ Drawer não mostra header próprio
        drawerPosition: 'left',
        drawerStyle: {
          width: 250,
        },
      }}
    >
      <Drawer.Screen 
        name="Main" 
        component={MainStack} 
        options={{ 
          title: 'Início',
          drawerLabelStyle: {
            fontWeight: 'bold',
          },
          drawerIcon:({ color, size })=> (
            <Ionicons name="add-circle-outline" size={size} color={color}/>
          ),
        }}
      />
      <Drawer.Screen 
        name="Gallery" 
        component={GalleryScreen} 
        options={{ 
          title: 'Galeria',
          drawerLabelStyle: {
            fontWeight: 'bold',
          },
          drawerIcon:({ color, size })=> (
            <Ionicons name="add-circle-outline" size={size} color={color}/>
          ),
        }}
      />
      <Drawer.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ 
          title: 'Câmera',
          drawerLabelStyle: {
            fontWeight: 'bold',
          },
          drawerIcon:({ color, size })=> (
            <Ionicons name="add-circle-outline" size={size} color={color}/>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}