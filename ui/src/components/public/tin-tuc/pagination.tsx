'use client'
import { Pagination } from 'antd';
import { useRouter } from 'next/navigation';
interface IProps {
    meta: IMeta,
}

const PaginationTinTuc = (props: IProps) => {
    const { meta } = props
    const router = useRouter()

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams()

        params.set('current', current.toString())
        params.set('pageSize', pageSize.toString())
        router.push(`/tin-tuc?${params.toString()}`);
    };

    return (
        <div style={{ marginTop: 24 }}>
            <Pagination align='center' pageSize={meta.pageSize} current={meta.current}
                onChange={(page: number, pageSize: number) => handleOnChangePage(page, pageSize)}
                total={meta.total} />
        </div>
    );
};

export default PaginationTinTuc;