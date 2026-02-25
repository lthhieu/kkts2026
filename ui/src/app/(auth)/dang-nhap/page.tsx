import { auth } from '@/auth';
import LoginComponent from '@/components/auth/login';
import { redirect } from 'next/navigation';

const Login = async () => {
    const session = await auth()
    if (session?.access_token) {
        console.log('Bạn đã đăng nhập, chuyển hướng đến trang chủ...');
        redirect('/quan-tri/trang-chu');
    }
    // console.log('Session:', session);
    return <LoginComponent />
};

export default Login;