import { Redirect } from 'expo-router';

export default function IndexPage() {
  // Redirigir a la página de home
  return <Redirect href="/home" />;
}
