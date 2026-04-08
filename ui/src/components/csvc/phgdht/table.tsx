'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Input, Popconfirm, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeletePhgdht, handleDeletePhgdhtMany } from '@/app/(main)/quan-tri/csvc/phgdht/actions';
import PhgdhtModal from '@/components/csvc/phgdht/modal';
import ModalImport from '@/components/csvc/phgdht/modal.import';
import { canCreateCsvc, canDeleteCsvc, canReadCsvc, canUpdateCsvc } from '@/libs/csvc';
import { CSVLink } from 'react-csv';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: IPhgdht[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
    hinhthucsohuu: IHinhthucsohuu[];
    tinhtrangcsvc: ITinhtrangcsvc[];
    phanloai: IPhanloai[];
    loaiphonghoc: ILoaiphonghoc[];
    loaidean: ILoaidean[];
    tinhtrangsudung: ITinhtrangsudung[];
}

const Context = React.createContext({ name: 'Default' });

const TablePhgdht = (props: IProps) => {
    const { data, access_token, meta, user, hinhthucsohuu, tinhtrangcsvc, phanloai, loaiphonghoc, loaidean, tinhtrangsudung } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | IPhgdht>(null);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [selectedMa, setSelectedMa] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const deleteItem = async (_id: string) => {
        const res = await handleDeletePhgdht(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const cancel: PopconfirmProps['onCancel'] = () => { };

    const columns: TableProps<IPhgdht>['columns'] = [
        {
            title: 'Mã PHGDHT',
            dataIndex: 'ma_phgdht',
            key: 'ma_phgdht',
            render: (_, record) => (
                <Space>
                    <Typography.Text ellipsis copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.ma_phgdht}</Typography.Text>
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
                            title="Xóa mục này?"
                            description={`Bạn thực sự muốn xóa "${record.name}"`}
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
            title: 'Hình thức sở hữu',
            dataIndex: ['htsh', 'name'],
            key: 'htsh',
            render: (_, record) => record.htsh?.name ?? '',
        },
        {
            title: 'Quy mô chỗ ngồi',
            dataIndex: 'qui_mo_cho_ngoi',
            key: 'qui_mo_cho_ngoi',
        },
        {
            title: 'Phân loại',
            dataIndex: ['phanloai', 'name'],
            key: 'phanloai',
            render: (_, record) => record.phanloai?.name ?? '',
        },
        {
            title: 'Loại phòng học',
            dataIndex: ['loaiphonghoc', 'name'],
            key: 'loaiphonghoc',
            render: (_, record) => record.loaiphonghoc?.name ?? '',
        },
        {
            title: 'Tình trạng CSVC',
            dataIndex: ['tinhtrangcsvc', 'name'],
            key: 'tinhtrangcsvc',
            render: (_, record) => record.tinhtrangcsvc?.name ?? '',
        },
        {
            title: 'Tình trạng sử dụng',
            dataIndex: ['tinh_trang_sd', 'name'],
            key: 'tinh_trang_sd',
            render: (_, record) => record.tinh_trang_sd?.name ?? '',
        },
        {
            title: 'Năm sử dụng',
            dataIndex: 'nam_sd',
            key: 'nam_sd',
        },
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        if (selectedMa) params.set('ma_phgdht', selectedMa);
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/phgdht?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        if (selectedMa) params.set('ma_phgdht', selectedMa);
        params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        router.push(`/quan-tri/csvc/phgdht?${params.toString()}`);
    };

    const deleteMany = async (ids: string[]) => {
        const res = await handleDeletePhgdhtMany(ids, access_token);
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
    const rowSelection: TableRowSelection<IPhgdht> = { selectedRowKeys, onChange: onSelectChange };

    const headers = [
        { label: 'Mã PHGDHT', key: 'ma_phgdht' },
        { label: 'Tên phòng', key: 'name' },
        { label: 'Diện tích (m²)', key: 'dt' },
        { label: 'Quy mô chỗ ngồi', key: 'qui_mo_cho_ngoi' },
        { label: 'Năm sử dụng', key: 'nam_sd' },
        { label: 'Địa chỉ', key: 'diachi' },
        { label: 'Ngày chuyển tình trạng', key: 'ngay_chuyen_tt' },
    ];

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify="space-between" align="center">
                <h2>Danh sách phòng học / giảng đường / hội trường</h2>
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
                            <CSVLink data={data} filename="phgdht.csv" headers={headers} separator=";">Export</CSVLink>
                        </Button>
                    )}
                    {canCreateCsvc(user ?? {} as IUser) && (
                        <Button onClick={() => { setStatus('CREATE'); setIsModalOpen(true); }} type="primary" icon={<FolderAddOutlined />}>Thêm mới</Button>
                    )}
                </div>
            </Flex>
            {canReadCsvc(user ?? {} as IUser) && (
                <Space style={{ marginBottom: 16 }}>
                    <Input allowClear placeholder="Tìm theo mã phòng" onChange={(e) => setSelectedMa(e.target.value)} value={selectedMa} />
                    <Input allowClear placeholder="Tìm theo tên phòng" onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />
                    <Button icon={<ClearOutlined />} onClick={() => { setSelectedName(undefined); setSelectedMa(undefined); }}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <Table<IPhgdht>
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kết quả`,
                    onChange: handleOnChangePage,
                    pageSizeOptions: [20, 50, 100],
                    defaultPageSize: 20,
                    showSizeChanger: true,
                }}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                rowKey="_id"
            />
            <PhgdhtModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                hinhthucsohuu={hinhthucsohuu}
                tinhtrangcsvc={tinhtrangcsvc}
                phanloai={phanloai}
                loaiphonghoc={loaiphonghoc}
                loaidean={loaidean}
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

export default TablePhgdht;
