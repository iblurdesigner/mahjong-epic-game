// Redirect root to home
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/home" />;
}