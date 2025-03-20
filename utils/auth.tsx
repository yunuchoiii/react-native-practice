import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

interface SignInParams {
  code: string;
  password: string;
}

type UserCredential = FirebaseAuthTypes.UserCredential;
type AuthCallback = (user: FirebaseAuthTypes.User | null) => void;

export const signIn = ({
  code,
  password,
}: SignInParams): Promise<UserCredential> => {
  return auth().signInWithEmailAndPassword(`${code}@haenaenda.com`, password);
};

export const subscribeAuth = (callback: AuthCallback): (() => void) => {
  const unsubscribe = auth().onAuthStateChanged(callback);
  return unsubscribe;
};
