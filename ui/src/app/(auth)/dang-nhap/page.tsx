import { auth } from '@/auth';
import LoginComponent from '@/components/auth/login';

const Login = async () => {
    const session = await auth()
    // console.log('Session:', session);
    return <LoginComponent />
};

export default Login;