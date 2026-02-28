import LoginComponent from '@/components/auth/login';
import { Suspense } from 'react';

const Login = async () => {
    return (
        <Suspense fallback={null}>
            <LoginComponent />
        </Suspense>
    )
};

export default Login;