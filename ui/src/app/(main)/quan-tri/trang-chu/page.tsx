import { auth } from '@/auth';
import Home from '@/components/trang-chu/home';
import { sendRequest } from '@/utils/api';

const Trangchu = async () => {
    const session = await auth()
    const res = await sendRequest<IBackendResponse<IDatabase>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/databases/get-data`,
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    })
    return (
        <Home
            role={session?.user.role!}
            access_token={session?.access_token ?? ''}
            getData={res?.data!} />
    )
};

export default Trangchu;