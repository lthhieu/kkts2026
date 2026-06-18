'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Flex, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { canCreateCsvc, canDeleteCsvc, canReadCsvc, canUpdateCsvc } from '@/libs/csvc';
import { handleDeleteNghiencuu, handleDeleteNghiencuuMany, handleExportNghiencuu } from '@/app/(main)/quan-tri/csvc/nghien-cuu/actions';
import NghiencuuModal from '@/components/csvc/nghiencuu/modal';
import ModalImportNghiencuu from '@/components/csvc/nghiencuu/modal.import';
import NghiencuuDetail from '@/components/csvc/nghiencuu/detail';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: ICsvcSubject[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
    summary: ISummaryCsvc[] | null;
}

const Context = React.createContext({ name: 'Default' });
const { Text } = Typography;

const TableNghiencuu = (props: IProps) => {
    const { data, access_token, meta, user, summary } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | ICsvcSubject>(null);
    const [selectedRecord, setSelectedRecord] = useState<null | ICsvcSubject>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const router = useRouter();

    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [selectedMa, setSelectedMa] = useState<string | undefined>(undefined);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const showDrawer = (record: ICsvcSubject) => { setSelectedRecord(record); setOpenDrawer(true); };
    const onClose = () => setOpenDrawer(false);

    const deleteItem = async (_id: string) => {
        const res = await handleDeleteNghiencuu(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const confirm = (_id: string) => {
        deleteItem(_id);
    };

    const cancel: PopconfirmProps['onCancel'] = () => { };

    const columns: TableProps<ICsvcSubject>['columns'] = [
        {
            title: 'Mã phòng',
            dataIndex: 'ma',
            key: 'ma',
            render: (_, record) => (
                <Space>
                    <Typography.Text ellipsis copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.ma}</Typography.Text>
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => showDrawer(record)} />
                    </Tooltip>
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
                            title="Xóa phòng này?"
                            description={`Bạn thực sự muốn xóa "${record.name}"`}
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
            title: 'Tên phòng',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Diện tích (m²)',
            dataIndex: 'dt',
            key: 'dt',
        },
        {
            title: 'Số chỗ ngồi',
            dataIndex: 'qui_mo_cho_ngoi',
            key: 'qui_mo_cho_ngoi',
        },
        {
            title: 'Năm sử dụng',
            dataIndex: 'nam_sd',
            key: 'nam_sd',
        }
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        if (selectedMa) params.set('ma', selectedMa);
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/nghien-cuu?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        if (selectedMa) params.set('ma', selectedMa);
        params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        router.push(`/quan-tri/csvc/nghien-cuu?${params.toString()}`);
    };

    const deleteMany = async (ids: string[]) => {
        const res = await handleDeleteNghiencuuMany(ids, access_token);
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
    const rowSelection: TableRowSelection<ICsvcSubject> = { selectedRowKeys, onChange: onSelectChange };

    const handleExport = async () => {
        const blob = await handleExportNghiencuu(access_token);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'nghien-cuu.csv';
        a.click();

        window.URL.revokeObjectURL(url);
    };


    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex wrap style={{ marginBottom: 16, gap: 8 }} justify="space-between" align="center">
                <h2>Danh sách phòng nghiên cứu</h2>
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
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={handleExport}>
                            Export
                        </Button>
                    )}
                    {canCreateCsvc(user ?? {} as IUser) && (
                        <Button onClick={() => { setStatus('CREATE'); setIsModalOpen(true); }} type="primary" icon={<FolderAddOutlined />}>Thêm mới</Button>
                    )}
                </div>
            </Flex>
            {canReadCsvc(user ?? {} as IUser) && (
                <Space wrap style={{ marginBottom: 16 }}>
                    <Input
                        allowClear
                        placeholder="Tìm theo mã phòng"
                        onChange={(e) => setSelectedMa(e.target.value)}
                        value={selectedMa}
                    />
                    <Input
                        allowClear
                        placeholder="Tìm theo tên phòng"
                        onChange={(e) => setSelectedName(e.target.value)}
                        value={selectedName}
                    />
                    <Button icon={<ClearOutlined />} onClick={() => { setSelectedName(undefined); setSelectedMa(undefined); }}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 24, marginBottom: 12 }}>
                <Text strong>- Tổng diện tích phòng nghiên cứu:  {summary?.[0]?.totalDT?.toLocaleString('vi-VN')} m²</Text>
            </div>
            <Table<ICsvcSubject>
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
            <NghiencuuModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
            <ModalImportNghiencuu
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
            />
            <Drawer
                title="Chi tiết phòng nghiên cứu"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openDrawer}
                size="large"
                extra={
                    canUpdateCsvc(user ?? {} as IUser) && (
                        <Button type="primary" icon={<EditOutlined />}
                            onClick={() => { onClose(); setDataUpdate(selectedRecord); setStatus('UPDATE'); setIsModalOpen(true); }}>
                            Chỉnh sửa
                        </Button>
                    )
                }
            >
                <NghiencuuDetail data={selectedRecord} />
            </Drawer>
        </Context.Provider>
    );
};

export default TableNghiencuu;
