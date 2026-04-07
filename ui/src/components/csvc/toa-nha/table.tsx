'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Input, Popconfirm, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeleteToanha, handleDeleteToanhaMany } from '@/app/(main)/quan-tri/csvc/toa-nha/actions';
import ToanhaModal from '@/components/csvc/toa-nha/modal';
import ModalImport from '@/components/csvc/toa-nha/modal.import';
import { canCreateCsvc, canDeleteCsvc, canReadCsvc, canUpdateCsvc } from '@/libs/csvc';
import { CSVLink } from 'react-csv';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: IToanha[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
    hinhthucsohuu: IHinhthucsohuu[];
    tinhtrangsudung: ITinhtrangsudung[];
}

const Context = React.createContext({ name: 'Default' });

const TableToanha = (props: IProps) => {
    const { data, access_token, meta, user, hinhthucsohuu, tinhtrangsudung } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | IToanha>(null);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const deleteItem = async (_id: string) => {
        const res = await handleDeleteToanha(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const confirm = (_id: string) => {
        deleteItem(_id);
    };

    const cancel: PopconfirmProps['onCancel'] = () => {};

    const columns: TableProps<IToanha>['columns'] = [
        {
            title: 'Mã tòa nhà',
            dataIndex: 'ma_toanha',
            key: 'ma_toanha',
        },
        {
            title: 'Tên tòa nhà',
            dataIndex: 'ten_toanha',
            key: 'ten_toanha',
            render: (_, record) => (
                <Space>
                    <Typography.Text>{record.ten_toanha}</Typography.Text>
                    {canUpdateCsvc(user ?? {} as IUser) && (
                        <Tooltip title="Cập nhật">
                            <EditOutlined
                                style={{ color: '#1cc03d', cursor: 'pointer' }}
                                onClick={() => {
                                    setDataUpdate(record);
                                    setStatus('UPDATE');
                                    setIsModalOpen(true);
                                }}
                            />
                        </Tooltip>
                    )}
                    {canDeleteCsvc(user ?? {} as IUser) && (
                        <Popconfirm
                            title="Xóa tòa nhà này?"
                            description={`Bạn thực sự muốn xóa "${record.ten_toanha}"`}
                            onConfirm={() => confirm(record._id)}
                            onCancel={cancel}
                            okText="Đồng ý"
                            cancelText="Hủy"
                            placement="rightBottom"
                        >
                            <Tooltip title="Xóa">
                                <DeleteOutlined style={{ color: '#f12929', cursor: 'pointer' }} />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
        {
            title: 'Diện tích xây dựng (m²)',
            dataIndex: 'dtxd',
            key: 'dtxd',
        },
        {
            title: 'Tổng diện tích sàn (m²)',
            dataIndex: 'tong_dt_sxd',
            key: 'tong_dt_sxd',
        },
        {
            title: 'Số tầng',
            dataIndex: 'so_tang',
            key: 'so_tang',
        },
        {
            title: 'Năm sử dụng',
            dataIndex: 'nam_sd',
            key: 'nam_sd',
        },
        {
            title: 'Hình thức sở hữu',
            key: 'htsh',
            render: (_, record) => record.htsh?.name ?? '',
        },
        {
            title: 'Tình trạng sử dụng',
            key: 'tinh_trang_sd',
            render: (_, record) => record.tinh_trang_sd?.name ?? '',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'diachi',
            key: 'diachi',
        },
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedName) params.set('ten_toanha', selectedName);
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/toa-nha?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedName) params.set('ten_toanha', selectedName);
        params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        router.push(`/quan-tri/csvc/toa-nha?${params.toString()}`);
    };

    const deleteMany = async (ids: string[]) => {
        const res = await handleDeleteToanhaMany(ids, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const start = () => {
        setLoading(true);
        setTimeout(() => {
            deleteMany(selectedRowKeys as string[]);
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => setSelectedRowKeys(newSelectedRowKeys);
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection: TableRowSelection<IToanha> = { selectedRowKeys, onChange: onSelectChange };

    const headers = [
        { label: 'Mã tòa nhà', key: 'ma_toanha' },
        { label: 'Tên tòa nhà', key: 'ten_toanha' },
        { label: 'Diện tích xây dựng (m²)', key: 'dtxd' },
        { label: 'Tổng diện tích sàn (m²)', key: 'tong_dt_sxd' },
        { label: 'Số tầng', key: 'so_tang' },
        { label: 'Năm sử dụng', key: 'nam_sd' },
        { label: 'Địa chỉ', key: 'diachi' },
    ];

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify="space-between" align="center">
                <h2>Danh sách tòa nhà</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canDeleteCsvc(user ?? {} as IUser) && (
                        <Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>
                            Xóa {selectedRowKeys.length !== 0 && `(${selectedRowKeys.length})`}
                        </Button>
                    )}
                    {canCreateCsvc(user ?? {} as IUser) && (
                        <Button onClick={() => setIsModalImportOpen(true)} type="primary" icon={<CloudUploadOutlined />}>Import</Button>
                    )}
                    {mounted && canReadCsvc(user ?? {} as IUser) && (
                        <Button type="primary" icon={<CloudDownloadOutlined />}>
                            <CSVLink data={data} filename="toa-nha.csv" headers={headers} separator=";">Export</CSVLink>
                        </Button>
                    )}
                    {canCreateCsvc(user ?? {} as IUser) && (
                        <Button onClick={() => { setStatus('CREATE'); setIsModalOpen(true); }} type="primary" icon={<FolderAddOutlined />}>Thêm mới</Button>
                    )}
                </div>
            </Flex>
            {canReadCsvc(user ?? {} as IUser) && (
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        allowClear
                        placeholder="Tìm theo tên tòa nhà"
                        onChange={(e) => setSelectedName(e.target.value)}
                        value={selectedName}
                    />
                    <Button icon={<ClearOutlined />} onClick={() => setSelectedName(undefined)}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <Table<IToanha>
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kết quả`,
                    onChange: handleOnChangePage,
                    pageSizeOptions: [20, 50, 100, 200],
                    defaultPageSize: 20,
                    showSizeChanger: true,
                }}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                rowKey="_id"
            />
            <ToanhaModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                hinhthucsohuu={hinhthucsohuu}
                tinhtrangsudung={tinhtrangsudung}
            />
            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
            />
        </Context.Provider>
    );
};

export default TableToanha;
