import {SignInView} from './SignInView';
import {useSignInModel} from './useSignInModel';

export const SignInPage = () => {
  const model = useSignInModel();
  return <SignInView {...model} />;
};
