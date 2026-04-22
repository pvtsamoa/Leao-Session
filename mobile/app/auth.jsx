import * as WebBrowser from 'expo-web-browser';
import { Redirect } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function AuthCallback() {
  return <Redirect href="/" />;
}
