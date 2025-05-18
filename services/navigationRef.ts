import {
  createNavigationContainerRef,
  NavigationContainerRef,
} from "@react-navigation/native";
// RootStackParamList define los tipos de las rutas de la aplicación
import { RootStackParamList } from "../types";
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Función para navegar entre las pantallas de la aplicación.
 * 
 * Esta función permite navegar a través de la referencia a la navegación. 
 * Acepta el nombre de la ruta y los parámetros necesarios 
 * para esa ruta según el tipo RootStackParamList.
 * 
 * @param name - El nombre de la ruta a la que se desea navegar.
 * @param args - Los parámetros de la ruta, si son necesarios. Si la ruta no requiere parámetros, 
 *               se puede pasar un arreglo vacío.
 */
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName, 
  ...args: undefined extends RootStackParamList[RouteName]
    ? [] | [RootStackParamList[RouteName]] 
    : [RootStackParamList[RouteName]] 
) {
  
  if (navigationRef.isReady()) {
    // @ts-expect-error - TypeScript no puede inferir correctamente el tipo en este caso
    // Navega a la ruta indicada con los parámetros proporcionados
    navigationRef.navigate(name, ...args);
  }
}
