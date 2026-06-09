'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Input, Popconfirm, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeleteLoaiphong, handleDeleteLoaiphongMany, handleExportLoaiphong } from '@/app/(main)/quan-tri/csvc/danh-muc/loai-phong/actions';
import ModalImport from '@/components/csvc/danh-muc/loai-phong/modal.import';
import { canCreateDanhmuc, canDeleteDanhmuc, canReadDanhmuc, canUpdateDanhmuc } from '@/libs/danhmuc';
import LoaiphongModal from '@/components/csvc/danh-muc/loai-phong/modal';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: ILoaiphong[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
}

const Context = React.createContext({ name: 'Default' });

const TableLoaiphong = (props: IProps) => {
    const { data, access_token, meta, user } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | ILoaiphong>(null);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const deleteItem = async (_id: string) => {
        const res = await handleDeleteLoaiphong(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const columns: TableProps<ILoaiphong>['columns'] = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <Typography.Text copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.name}</Typography.Text>
                    {canUpdateDanhmuc(user ?? {} as IUser) && (
                        <Tooltip title="Cập nhật">
                            <EditOutlined style={{ color: '#1cc03d', cursor: 'pointer' }}
                                onClick={() => { setDataUpdate(record); setStatus('UPDATE'); setIsModalOpen(true); }} />
                        </Tooltip>
                    )}
                    {canDeleteDanhmuc(user ?? {} as IUser) && (
                        <Popconfirm title="Xóa mục này?" description={`Bạn thực sự muốn xóa "${record.name}"`}
                            onConfirm={() => deleteItem(record._id)} okText="Đồng ý" cancelText="Hủy" placement="rightBottom">
                            <Tooltip title="Xóa"><DeleteOutlined style={{ color: '#f12929', cursor: 'pointer' }} /></Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/danh-muc/loai-phong?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        router.push(`/quan-tri/csvc/danh-muc/loai-phong?${params.toString()}`);
    };

    const deleteMany = async (ids: string[]) => {
        const res = await handleDeleteLoaiphongMany(ids, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const start = () => {
        setLoading(true);
        setTimeout(() => { deleteMany(selectedRowKeys as string[]); setSelectedRowKeys([]); setLoading(false); }, 1000);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => setSelectedRowKeys(newSelectedRowKeys);
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection: TableRowSelection<ILoaiphong> = { selectedRowKeys, onChange: onSelectChange };
    const handleExport = async () => {
        const blob = await handleExportLoaiphong(access_token);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'loai-phong.csv';
        a.click();

        window.URL.revokeObjectURL(url);
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex wrap style={{ marginBottom: 16, gap: 8 }} justify="space-between" align="center">
                <h2>Danh sách loại phòng</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canDeleteDanhmuc(user ?? {} as IUser) && (
                        <Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>
                            Xóa {selectedRowKeys.length !== 0 && `(${selectedRowKeys.length})`}
                        </Button>
                    )}
                    {canCreateDanhmuc(user ?? {} as IUser) && (
                        <Button onClick={() => setIsModalImportOpen(true)} type="primary" icon={<CloudUploadOutlined />}>Import</Button>
                    )}
                    {mounted && canReadDanhmuc(user ?? {} as IUser) && (
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={handleExport}>
                            Export
                        </Button>
                    )}
                    {canCreateDanhmuc(user ?? {} as IUser) && (
                        <Button onClick={() => { setStatus('CREATE'); setIsModalOpen(true); }} type="primary" icon={<FolderAddOutlined />}>Thêm mới</Button>
                    )}
                </div>
            </Flex>
            {canReadDanhmuc(user ?? {} as IUser) && (
                <Space wrap style={{ marginBottom: 16 }}>
                    <Input allowClear placeholder="Tìm theo tên" onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />
                    <Button icon={<ClearOutlined />} onClick={() => setSelectedName(undefined)}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <Table<ILoaiphong>
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: meta.current, pageSize: meta.pageSize, total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kết quả`,
                    onChange: handleOnChangePage, pageSizeOptions: [20, 50, 100], defaultPageSize: 20, showSizeChanger: true,
                }}
                rowSelection={rowSelection}
                columns={columns} dataSource={data} rowKey="_id"
            />
            <LoaiphongModal setStatus={setStatus} status={status} access_token={access_token}
                isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
                setDataUpdate={setDataUpdate} dataUpdate={dataUpdate} />
            <ModalImport access_token={access_token} isModalImportOpen={isModalImportOpen} setIsModalImportOpen={setIsModalImportOpen} />
        </Context.Provider>
    );
};

export default TableLoaiphong
