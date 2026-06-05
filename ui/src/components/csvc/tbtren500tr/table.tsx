'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Flex, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { canCreateCsvc, canDeleteCsvc, canReadCsvc, canUpdateCsvc } from '@/libs/csvc';
import { CSVLink } from 'react-csv';
import { handleDeleteTBTren500tr, handleDeleteTBTren500trMany } from '@/app/(main)/quan-tri/csvc/thiet-bi-tren-500-trieu/actions';
import TBTren500trModal from '@/components/csvc/tbtren500tr/modal';
import ModalImportTBTren500tr from '@/components/csvc/tbtren500tr/modal.import';
import TBTren500trDetail from '@/components/csvc/tbtren500tr/detail';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: ITBTren500tr[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
    units: IUnit[] | null;
    // summary: ISummaryCsvc[] | null;
    availableChildren: { _id: string, code: string, name: string }[] | null;
}

const Context = React.createContext({ name: 'Default' });

const TableTBTren500tr = (props: IProps) => {
    const { data, access_token, meta, user, units, availableChildren } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | ITBTren500tr>(null);
    const [selectedRecord, setSelectedRecord] = useState<null | ITBTren500tr>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const router = useRouter();

    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [selectedCode, setSelectedCode] = useState<string | undefined>(undefined);
    const [selectedUnit, setSelectedUnit] = useState<string | undefined>(undefined);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const showDrawer = (record: ITBTren500tr) => { setSelectedRecord(record); setOpenDrawer(true); };
    const onClose = () => setOpenDrawer(false);

    const buildTree = (data: ITBTren500tr[]) => {
        const map = new Map();

        data.forEach(item => {
            map.set(item._id, {
                ...item,
            });
        });

        const roots: any[] = [];

        data.forEach(item => {

            console.log('item:', item.name);
            console.log('parentId:', item.parentId);
            console.log('parent:', map.get(item.parentId));

            if (item.parentId) {
                const parent = map.get(item.parentId);

                if (parent) {
                    if (!parent.children) {
                        parent.children = [];
                    }

                    parent.children.push(map.get(item._id));
                } else {
                    roots.push(map.get(item._id));
                }
            } else {
                roots.push(map.get(item._id));
            }
        });

        return roots;
    };

    const deleteItem = async (_id: string) => {
        const res = await handleDeleteTBTren500tr(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const confirm = (_id: string) => {
        deleteItem(_id);
    };

    const cancel: PopconfirmProps['onCancel'] = () => { };

    const columns: TableProps<ITBTren500tr>['columns'] = [
        {
            title: 'Tên tài sản',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space style={{ maxWidth: 250 }}>
                    <Typography.Text ellipsis={{ tooltip: record.name }} copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.name}</Typography.Text>
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
            title: 'Mã TSCĐ',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (_, record) => (
                <Space style={{ maxWidth: 250, display: 'inline-block', }}>
                    <Typography.Text ellipsis>
                        {record.description || '—'}
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
            title: 'Năm sử dụng',
            dataIndex: 'yearUse',
            key: 'yearUse',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Nguyên giá',
            dataIndex: 'totalOriginalPrice',
            key: 'totalOriginalPrice',
            render: (value) =>
                value
                    ? new Intl.NumberFormat(
                        'vi-VN',
                        {
                            style: 'currency',
                            currency: 'VND',
                        }
                    ).format(value)
                    : '—',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        }
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        if (selectedCode) params.set('code', selectedCode);
        if (selectedUnit) params.set('unit', selectedUnit);
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/thiet-bi-tren-500-trieu?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        if (selectedCode) params.set('code', selectedCode);
        if (selectedUnit) params.set('unit', selectedUnit);
        params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        router.push(`/quan-tri/csvc/thiet-bi-tren-500-trieu?${params.toString()}`);
    };

    const deleteMany = async (ids: string[]) => {
        const res = await handleDeleteTBTren500trMany(ids, access_token);
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
    const rowSelection: TableRowSelection<ITBTren500tr> = { selectedRowKeys, onChange: onSelectChange };

    const headers = [
        { label: 'Tên thiết bị', key: 'name' },
        { label: 'Mã TSCĐ', key: 'code' },
        { label: 'Mô tả', key: 'description' },
        { label: 'Đơn vị', key: 'unit' },
        { label: 'Năm sử dụng', key: 'yearUse' },
        { label: 'Số lượng', key: 'quantity' },
        { label: 'Nguyên giá', key: 'originalPrice' },
        { label: 'Ghi chú', key: 'note' },
    ];

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16, gap: 8 }} justify="space-between" align="center" wrap>
                <h2>Danh sách thiết bị trên 500 triệu</h2>
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
                            <CSVLink data={data} filename="thiet-bi-tren-500tr.csv" headers={headers} separator=";">Export</CSVLink>
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
                        placeholder="Tìm theo mã TSCĐ"
                        onChange={(e) => setSelectedCode(e.target.value)}
                        value={selectedCode}
                    />
                    <Input
                        allowClear
                        placeholder="Tìm theo tên thiết bị"
                        onChange={(e) => setSelectedName(e.target.value)}
                        value={selectedName}
                    />
                    <Select
                        style={{ width: '100%' }}
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Vui lòng chọn đơn vị"
                        // 🔥 Gán value từ state vào đây
                        value={selectedUnit}
                        onChange={(value: string) => setSelectedUnit(value)}
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
                    <Button icon={<ClearOutlined />} onClick={() => { setSelectedName(undefined); setSelectedCode(undefined); setSelectedUnit(undefined); }}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <Table<ITBTren500tr>
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kết quả`,
                    onChange: handleOnChangePage,
                    pageSizeOptions: [50, 100, 200],
                    defaultPageSize: 50,
                    showSizeChanger: true,
                }}
                rowSelection={{ ...rowSelection, checkStrictly: false }}
                columns={columns}
                dataSource={data}
                rowKey="_id"
            />
            <TBTren500trModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                units={units}
                availableChildren={availableChildren}
            />
            <ModalImportTBTren500tr
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
            />
            <Drawer
                title="Chi tiết thiết bị"
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
                <TBTren500trDetail data={selectedRecord} />
            </Drawer>
        </Context.Provider>
    );
};

export default TableTBTren500tr;
