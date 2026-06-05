'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Flex, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import ToanhaDetail from '@/components/csvc/toa-nha/detail';
import { useRouter } from 'next/navigation';
import { handleDeleteToanha, handleDeleteToanhaMany } from '@/app/(main)/quan-tri/csvc/toa-nha/actions';
import ToanhaModal, { placeOptions } from '@/components/csvc/toa-nha/modal';
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
    summary: ISummaryToanha[] | null;
}

const Context = React.createContext({ name: 'Default' });
const { Text } = Typography;

const TableToanha = (props: IProps) => {
    const { data, access_token, meta, user, hinhthucsohuu, tinhtrangsudung, summary } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | IToanha>(null);
    const [selectedRecord, setSelectedRecord] = useState<null | IToanha>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const router = useRouter();

    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [selectedMa, setSelectedMa] = useState<string | undefined>(undefined);
    const [selectedPlace, setSelectedPlace] = useState<number | undefined>(undefined);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const showDrawer = (record: IToanha) => { setSelectedRecord(record); setOpenDrawer(true); };
    const onClose = () => setOpenDrawer(false);

    const deleteItem = async (_id: string) => {
        const res = await handleDeleteToanha(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const confirm = (_id: string) => {
        deleteItem(_id);
    };

    const cancel: PopconfirmProps['onCancel'] = () => { };

    const columns: TableProps<IToanha>['columns'] = [
        {
            title: 'Mã tòa nhà',
            dataIndex: 'ma_toanha',
            key: 'ma_toanha',
            render: (_, record) => (
                <Space>
                    <Typography.Text ellipsis copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.ma_toanha}</Typography.Text>
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
            title: 'Tên tòa nhà',
            dataIndex: 'ten_toanha',
            key: 'ten_toanha',
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
            title: 'Địa chỉ',
            dataIndex: 'diachi',
            key: 'diachi',
        },
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedName) params.set('ten_toanha', selectedName);
        if (selectedMa) params.set('ma_toanha', selectedMa);
        if (selectedPlace) params.set('place', selectedPlace.toString());
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/toa-nha?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedName) params.set('ten_toanha', selectedName);
        if (selectedMa) params.set('ma_toanha', selectedMa);
        if (selectedPlace !== undefined && selectedPlace !== null) {
            params.set('place', selectedPlace.toString());
        } params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        console.log(params.toString());
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
        { label: 'Hình thức sở hữu', key: 'htsh.name' },
        { label: 'Tình trạng sử dụng', key: 'tinh_trang_sd.name' },
        { label: 'Địa chỉ', key: 'diachi' },
        { label: 'Ngày chuyển tình trạng', key: 'ngay_chuyen_tt' }
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
                        placeholder="Tìm theo mã tòa nhà"
                        onChange={(e) => setSelectedMa(e.target.value)}
                        value={selectedMa}
                    />
                    <Input
                        allowClear
                        placeholder="Tìm theo tên tòa nhà"
                        onChange={(e) => setSelectedName(e.target.value)}
                        value={selectedName}
                    />
                    <Select
                        allowClear
                        onClear={() => setSelectedPlace(undefined)}
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Chọn vị trí"
                        style={{ minWidth: 200 }}
                        value={selectedPlace}
                        onChange={(val) => {
                            setSelectedPlace(val)

                        }}
                        options={placeOptions.map(({ value, label }) => ({ value, label }))}
                    />
                    <Button icon={<ClearOutlined />} onClick={() => { setSelectedName(undefined); setSelectedMa(undefined); setSelectedPlace(undefined); }}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 24,
                    marginBottom: 12,
                    gap: 4,
                }}
            >
                {summary?.map((item) => (
                    <div key={item.place}>
                        <Text strong>
                            - {item.place === 0 ? 'Trường SPKT' : 'KTX'}:
                        </Text>

                        <div style={{ marginLeft: 16 }}>
                            <Text>
                                + Tổng diện tích xây dựng:{' '}
                                {item.totalDTXD.toLocaleString('vi-VN')} m²
                            </Text>

                            <br />

                            <Text>
                                + Tổng diện tích sàn xây dựng:{' '}
                                {item.totalTongDTSXD.toLocaleString('vi-VN')} m²
                            </Text>
                        </div>
                    </div>
                ))}
            </div>
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
            <Drawer
                title="Chi tiết Tòa nhà"
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
                <ToanhaDetail data={selectedRecord} />
            </Drawer>
        </Context.Provider>
    );
};

export default TableToanha;
