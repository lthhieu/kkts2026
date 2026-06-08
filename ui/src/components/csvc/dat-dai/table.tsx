'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Flex, Input, Popconfirm, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import DatdaiDetail from '@/components/csvc/dat-dai/detail';
import { useRouter } from 'next/navigation';
import { handleDeleteDatdai, handleDeleteDatdaiMany, handleExportDatdai } from '@/app/(main)/quan-tri/csvc/dat-dai/actions';
import DatdaiModal from '@/components/csvc/dat-dai/modal';
import ModalImport from '@/components/csvc/dat-dai/modal.import';
import { canCreateCsvc, canDeleteCsvc, canReadCsvc, canUpdateCsvc } from '@/libs/csvc';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: IDatdai[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
    summary: ISummary;
}

const Context = React.createContext({ name: 'Default' });
const { Text } = Typography;

const TableDatdai = (props: IProps) => {
    const { data, access_token, meta, user, summary } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | IDatdai>(null);
    const [selectedRecord, setSelectedRecord] = useState<null | IDatdai>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const showDrawer = (record: IDatdai) => { setSelectedRecord(record); setOpenDrawer(true); };
    const onClose = () => setOpenDrawer(false);

    const deleteItem = async (_id: string) => {
        const res = await handleDeleteDatdai(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const cancel: PopconfirmProps['onCancel'] = () => { };

    const columns: TableProps<IDatdai>['columns'] = [
        {
            title: 'Mã giấy CNQSH',
            dataIndex: 'ma_giay_cnqsh',
            key: 'ma_giay_cnqsh',
            render: (_, record) => (
                <Space>
                    <Typography.Text ellipsis={{ tooltip: record.ma_giay_cnqsh }} copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.ma_giay_cnqsh}</Typography.Text>
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => showDrawer(record)} />
                    </Tooltip>
                    {canUpdateCsvc(user ?? {} as IUser) && (
                        <Tooltip title="Cập nhật">
                            <EditOutlined
                                style={{ color: '#1cc03d', cursor: 'pointer' }}
                                onClick={() => { setDataUpdate(record); setStatus('UPDATE'); setIsModalOpen(true); }}
                            />
                        </Tooltip>
                    )}
                    {canDeleteCsvc(user ?? {} as IUser) && (
                        <Popconfirm
                            title="Xóa đất đai này?"
                            description={`Bạn thực sự muốn xóa "${record.ma_giay_cnqsh}"`}
                            onConfirm={() => deleteItem(record._id)}
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
        { title: 'Thửa', dataIndex: 'thua', key: 'thua' },
        { title: 'Diện tích (m²)', dataIndex: 'dt', key: 'dt' },
        { title: 'Địa chỉ', dataIndex: 'diachi', key: 'diachi' },
        { title: 'Ghi chú', dataIndex: 'ghichu', key: 'ghichu' },
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedName) params.set('ma_giay_cnqsh', selectedName);
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/dat-dai?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedName) params.set('ma_giay_cnqsh', selectedName);
        params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        router.push(`/quan-tri/csvc/dat-dai?${params.toString()}`);
    };

    const deleteMany = async (ids: string[]) => {
        const res = await handleDeleteDatdaiMany(ids, access_token);
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
    const rowSelection: TableRowSelection<IDatdai> = { selectedRowKeys, onChange: onSelectChange };

    const handleExport = async () => {
        const blob = await handleExportDatdai(access_token);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'dat-dai.csv';
        a.click();

        window.URL.revokeObjectURL(url);
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex wrap style={{ marginBottom: 16 }} justify="space-between" align="center">
                <h2>Danh sách đất đai</h2>
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
                    <Input allowClear placeholder="Tìm theo mã giấy CNQSH" onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />
                    <Button icon={<ClearOutlined />} onClick={() => setSelectedName(undefined)}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 24, marginBottom: 12 }}>
                <Text strong>- Tổng diện tích đất của trường: {summary.totalArea.toLocaleString('vi-VN')} m²</Text>
                <Text strong>- Tổng diện tích trừ phần thu hồi làm đường: {summary.revokedArea.toLocaleString('vi-VN')} m²</Text>
            </div>
            <Table<IDatdai>
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
            <DatdaiModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
            />
            <Drawer
                title="Chi tiết Đất đai"
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
                <DatdaiDetail data={selectedRecord} />
            </Drawer>
        </Context.Provider>
    );
};

export default TableDatdai;
