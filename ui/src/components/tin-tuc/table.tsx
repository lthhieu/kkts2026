'use client'
import React, { useMemo, useState } from 'react';
import { Button, Flex, Grid, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { canCreateNews, canDeleteNews, canReadNews, canUpdateNews } from '@/libs/news';
import NewsModal from '@/components/tin-tuc/modal';
import { handleDeleteNews, handleDeleteNewsMany } from '@/app/(main)/quan-tri/tin-tuc/actions';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
const { useBreakpoint } = Grid;

interface IProps {
    news: INews[],
    access_token: string,
    meta: IMeta,
    user: IUser | null
}
export const categoryArr = [
    { value: 'Tuyển sinh', label: 'Tuyển sinh' },
    { value: 'Hợp tác - Nghiên cứu khoa học', label: 'Hợp tác - Nghiên cứu khoa học' },
]

const Context = React.createContext({ name: 'Default' });

const TableNews = (props: IProps) => {
    const { news, access_token, meta, user } = props
    const [isModalOpen, SetIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [status, setStatus] = useState('')
    const [dataUpdate, setDataUpdate] = useState<null | INews>(null)
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const screens = useBreakpoint();
    const isMobile = !screens.md;  // < 768px
    const [selectedTitle, setSelectedTitle] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

    const showModal = () => {
        setStatus("CREATE")
        SetIsModalOpen(true);
    }
    const confirm = (_id: string) => {
        deleteNews(_id)
    };
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // console.log(e);
    };

    const deleteNews = async (_id: string) => {
        const res = await handleDeleteNews(_id, access_token)
        if (!res.data) {
            api.error({
                title: `Có lỗi xảy ra`,
                description: res.message,
                placement: 'topRight',
            });
        }
        else {
            messageApi.success(res.message);
        }
    }

    const deleteNewsMany = async (ids: string[]) => {
        const res = await handleDeleteNewsMany(ids, access_token)
        if (!res.data) {
            api.error({
                title: `Có lỗi xảy ra`,
                description: res.message,
                placement: 'topRight',
            });
        }
        else {
            messageApi.success(res.message);
        }
    }

    const columns: TableProps<INews>['columns'] = [
        {
            title: 'Tên tin tức',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => <Space style={{ maxWidth: 300 }}>
                <Typography.Text ellipsis copyable={{ text: record._id, tooltips: 'Sao chép' }}>
                    {record.title}
                </Typography.Text>
                {canUpdateNews(user as IUser) && (
                    <Tooltip title="Cập nhật">
                        <EditOutlined
                            style={{ color: '#1cc03d', cursor: 'pointer' }}
                            onClick={() => {
                                setDataUpdate(record)
                                setStatus("UPDATE")
                                SetIsModalOpen(true)
                            }}
                        />
                    </Tooltip>
                )}

                {canDeleteNews(user as IUser) && (
                    <Popconfirm
                        title="Xóa tin tức này?"
                        description={`Bạn thực sự muốn xóa tin tức ${record.title}`}
                        onConfirm={() => confirm(record._id)}
                        onCancel={cancel}
                        okText="Đồng ý"
                        cancelText="Hủy"
                        placement='rightBottom'
                    >
                        <Tooltip title="Xóa">
                            <DeleteOutlined
                                style={{ color: '#f12929', cursor: 'pointer' }} />
                        </Tooltip>
                    </Popconfirm>


                )}
            </Space>
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Tác giả',
            dataIndex: ['author', 'name'],
            key: 'author',
        },
    ];
    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams()

        if (selectedTitle) params.set('title', selectedTitle)
        if (selectedCategory) params.set('category', selectedCategory)

        params.set('current', current.toString())
        params.set('pageSize', pageSize.toString())
        router.push(`/quan-tri/tin-tuc?${params.toString()}`);
    };
    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            deleteNewsMany(selectedRowKeys as string[])
            setSelectedRowKeys([])
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection: TableRowSelection<INews> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    // Hàm xóa bộ lọc
    const handleClear = () => {
        setSelectedTitle(undefined)
        setSelectedCategory(undefined)
    };
    const handleFilter = () => {
        const params = new URLSearchParams()
        if (selectedTitle) params.set('title', selectedTitle)
        if (selectedCategory) params.set('category', selectedCategory)

        params.set('current', '1')
        params.set('pageSize', meta.pageSize.toString())

        router.push(`/quan-tri/tin-tuc?${params.toString()}`)
    }
    // Hàm xử lý khi chọn category
    const onChangeCategory = (value: string) => {
        setSelectedCategory(value);
    };
    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify='space-between'
                align={isMobile ? 'stretch' : 'center'}
                vertical={isMobile} gap={16}>
                <h2>Danh sách tin tức</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canDeleteNews(user ?? {} as IUser) && (<Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>Xóa {selectedRowKeys.length !== 0 && `(${selectedRowKeys.length})`}</Button>)}

                    {canCreateNews(user ?? {} as IUser) && (<Button onClick={showModal} type='primary' icon={<FolderAddOutlined />}>Thêm mới</Button>)}
                </div>
            </Flex>
            {canReadNews(user ?? {} as IUser) && (<Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                <Input allowClear placeholder="Tìm theo tên tin tức"
                    onChange={(e) => setSelectedTitle(e.target.value)} value={selectedTitle} />
                <Select
                    style={{ width: '100%' }}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn loại tin tức"
                    value={selectedCategory}
                    onChange={onChangeCategory}
                    allowClear
                    options={categoryArr}
                />

                <Button icon={<ClearOutlined />} onClick={handleClear}>Xóa bộ lọc</Button>
                <Button icon={<SearchOutlined />} type='primary' onClick={handleFilter}>Lọc</Button>
            </Space>)}
            <Table<INews>
                scroll={{ x: "max-content" }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kết quả`,
                    onChange: (page: number, pageSize: number) => handleOnChangePage(page, pageSize),
                    pageSizeOptions: [10, 20],
                    defaultPageSize: 10,
                    showSizeChanger: true,
                }}
                rowSelection={{ type: 'checkbox', ...rowSelection }}
                columns={columns} dataSource={news} rowKey={"_id"} />
            <NewsModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={SetIsModalOpen}
                //update info
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </Context.Provider>
    )
}

export default TableNews;