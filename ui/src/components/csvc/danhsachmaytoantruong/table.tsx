'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Divider, Drawer, Flex, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { canCreateCsvc, canDeleteCsvc, canReadCsvc, canUpdateCsvc } from '@/libs/csvc';
import { handleDeleteMaytoantruong, handleDeleteMaytoantruongMany, handleExportMaytoantruong } from '@/app/(main)/quan-tri/csvc/danh-sach-may-toan-truong/actions';
import MaytoantruongModal, { MayCate, MayCateLabel } from '@/components/csvc/danhsachmaytoantruong/modal';
import ModalImportMaytoantruong from '@/components/csvc/danhsachmaytoantruong/modal.import';
import MaytoantruongDetail from '@/components/csvc/danhsachmaytoantruong/detail';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: IMaytoantruong[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
    summary: ISummaryMaytoantruong[] | null;
    rooms: IRoom[];
    units: IUnit[];
}

const Context = React.createContext({ name: 'Default' });

const TableMaytoantruong = (props: IProps) => {
    const { data, access_token, meta, user, summary, rooms, units } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | IMaytoantruong>(null);
    const [selectedRecord, setSelectedRecord] = useState<null | IMaytoantruong>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const router = useRouter();

    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [selectedDes, setSelectedDes] = useState<string | undefined>(undefined);
    const [selectedUnit, setSelectedUnit] = useState<string | undefined>(undefined);
    const [selectedRoom, setSelectedRoom] = useState<string | undefined>(undefined);
    const [selectedCate, setSelectedCate] = useState<string | undefined>(undefined);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const showDrawer = (record: IMaytoantruong) => { setSelectedRecord(record); setOpenDrawer(true); };
    const onClose = () => setOpenDrawer(false);

    const deleteItem = async (_id: string) => {
        const res = await handleDeleteMaytoantruong(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const confirm = (_id: string) => {
        deleteItem(_id);
    };

    const cancel: PopconfirmProps['onCancel'] = () => { };

    const columns: TableProps<IMaytoantruong>['columns'] = [
        {
            title: 'Tên TSCĐ',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space style={{ maxWidth: 250 }}>
                    <Typography.Text ellipsis copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.name}</Typography.Text>
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
                            title="Xóa tài sản này?"
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
            title: 'Mã số / Mô tả',
            dataIndex: 'des',
            key: 'des',
            render: (_, record) => (
                <Space style={{ maxWidth: 250, display: 'inline-block', }}>
                    <Typography.Text ellipsis>
                        {record.des || 'Không có mô tả'}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: 'Đơn vị',
            dataIndex: ['unit', 'name'],
            key: 'unit',
            render: (_, record) => <Space style={{ maxWidth: 150 }}>
                <Typography.Text ellipsis copyable={{ text: record?.unit?._id, tooltips: 'Sao chép' }}>
                    {record?.unit ? record.unit.name : '—'}
                </Typography.Text>
            </Space>
        },
        {
            title: 'Phòng',
            dataIndex: ['room', 'name'],
            key: 'room',
            render: (_, record) => <Space style={{ maxWidth: 150 }}>
                <Typography.Text ellipsis copyable={{ text: record?.room?._id, tooltips: 'Sao chép' }}>
                    {record?.room ? record.room.name : '—'}
                </Typography.Text>
            </Space>
        },
        {
            title: 'Năm sử dụng',
            dataIndex: 'nam_sd',
            key: 'nam_sd',
        },
        {
            title: 'Số lượng',
            dataIndex: 'sl',
            key: 'sl',
        },
        {
            title: 'Nguyên giá',
            dataIndex: 'nguyengia',
            key: 'nguyengia',
            render: (value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        }
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        if (selectedDes) params.set('des', selectedDes);
        if (selectedUnit) params.set('unit', selectedUnit);
        if (selectedRoom) params.set('room', selectedRoom);
        if (selectedCate) params.set('cate', selectedCate);
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/danh-sach-may-toan-truong?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        if (selectedDes) params.set('des', selectedDes);
        if (selectedUnit) params.set('unit', selectedUnit);
        if (selectedRoom) params.set('room', selectedRoom);
        if (selectedCate) params.set('cate', selectedCate);
        params.set('current', '1');
        params.set('pageSize', meta?.pageSize.toString());
        console.log(params.toString());
        router.push(`/quan-tri/csvc/danh-sach-may-toan-truong?${params.toString()}`);
    };

    const deleteMany = async (ids: string[]) => {
        const res = await handleDeleteMaytoantruongMany(ids, access_token);
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
    const rowSelection: TableRowSelection<IMaytoantruong> = { selectedRowKeys, onChange: onSelectChange };

    const handleExport = async () => {
        const blob = await handleExportMaytoantruong(access_token);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'may-toan-truong.csv';
        a.click();

        window.URL.revokeObjectURL(url);
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex wrap style={{ marginBottom: 16, gap: 8 }} justify="space-between" align="center">
                <h2>Danh sách Tài sản cố định</h2>
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
                <Space style={{ marginBottom: 16 }} wrap>
                    <Input
                        allowClear
                        placeholder="Tìm theo tên"
                        onChange={(e) => setSelectedName(e.target.value)}
                        value={selectedName}
                    />
                    <Input
                        allowClear
                        placeholder="Tìm theo mã số / mô tả"
                        onChange={(e) => setSelectedDes(e.target.value)}
                        value={selectedDes}
                    />
                    <Select
                        style={{ width: '100%' }}
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Vui lòng chọn loại tài sản"
                        // 🔥 Gán value từ state vào đây
                        value={selectedCate}
                        onChange={(value) => setSelectedCate(value)}
                        allowClear
                        options={Object.values(MayCate).map((value) => ({
                            value,
                            label: MayCateLabel[value],
                        }))}
                    />
                    <Select
                        style={{ width: '100%' }}
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Vui lòng chọn đơn vị"
                        // 🔥 Gán value từ state vào đây
                        value={selectedUnit}
                        onChange={(value) => setSelectedUnit(value)}
                        allowClear
                        options={
                            units && units.length > 0
                                ? units.map(({ _id, name }) => ({
                                    value: _id,
                                    label: name
                                }))
                                : []
                        }
                    />
                    <Select
                        style={{ width: '100%' }}
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Vui lòng chọn phòng"
                        // 🔥 Gán value từ state vào đây
                        value={selectedRoom}
                        onChange={(value) => setSelectedRoom(value)}
                        allowClear
                        options={
                            rooms && rooms.length > 0
                                ? rooms.map(({ _id, name }) => ({
                                    value: _id,
                                    label: name
                                }))
                                : []
                        }
                    />
                    <Button icon={<ClearOutlined />} onClick={() => { setSelectedName(undefined); setSelectedDes(undefined); setSelectedRoom(undefined); setSelectedUnit(undefined); setSelectedCate(undefined); }}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <Table
                size="small"
                pagination={false}
                rowKey="cate"
                dataSource={summary ?? []}
                columns={[
                    {
                        title: 'Loại tài sản',
                        dataIndex: 'cate',
                        key: 'cate',
                        render: (cate) => MayCateLabel[cate as keyof typeof MayCateLabel],
                    },
                    {
                        title: 'Tổng số lượng',
                        dataIndex: 'totalSL',
                        key: 'totalSL',
                        align: 'right',
                        render: (value) => value.toLocaleString('vi-VN'),
                    },
                    {
                        title: 'Tổng nguyên giá',
                        dataIndex: 'totalNguyenGia',
                        key: 'totalNguyenGia',
                        align: 'right',
                        render: (value) =>
                            value.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }),
                    },
                ]}
            />

            <Divider />
            <Table<IMaytoantruong>
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: meta?.current,
                    pageSize: meta?.pageSize,
                    total: meta?.total,
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
            <MaytoantruongModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                rooms={rooms}
                units={units}
            />
            <ModalImportMaytoantruong
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
            />
            <Drawer
                title="Chi tiết Tài sản cố định"
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
                <MaytoantruongDetail data={selectedRecord} />
            </Drawer>
        </Context.Provider>
    );
};

export default TableMaytoantruong;
