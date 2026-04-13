'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Flex, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import CtkDetail from '@/components/csvc/ctk/detail';
import { useRouter } from 'next/navigation';
import { handleDeleteCtk, handleDeleteCtkMany } from '@/app/(main)/quan-tri/csvc/ctk/actions';
import CtkModal from '@/components/csvc/ctk/modal';
import ModalImport from '@/components/csvc/ctk/modal.import';
import { canCreateCsvc, canDeleteCsvc, canReadCsvc, canUpdateCsvc } from '@/libs/csvc';
import { CSVLink } from 'react-csv';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: ICtk[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
    loaicongtrinhcsvc: ILoaicongtrinhcsvc[];
    mucdichsudungcsvc: IMucdichsudungcsvc[];
    tinhtrangcsvc: ITinhtrangcsvc[];
    hinhthucsohuu: IHinhthucsohuu[];
    luachon: ILuachon[];
    tinhtrangsudung: ITinhtrangsudung[];
}

const Context = React.createContext({ name: 'Default' });

const TableCtk = (props: IProps) => {
    const { data, access_token, meta, user, loaicongtrinhcsvc, mucdichsudungcsvc, tinhtrangcsvc, hinhthucsohuu, luachon, tinhtrangsudung } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | ICtk>(null);
    const [selectedRecord, setSelectedRecord] = useState<null | ICtk>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedMa, setSelectedMa] = useState<string | undefined>(undefined);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [selectedLoai, setSelectedLoai] = useState<string | undefined>(undefined);
    const [selectedMucDich, setSelectedMucDich] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const showDrawer = (record: ICtk) => { setSelectedRecord(record); setOpenDrawer(true); };
    const onClose = () => setOpenDrawer(false);

    const deleteItem = async (_id: string) => {
        const res = await handleDeleteCtk(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const cancel: PopconfirmProps['onCancel'] = () => { };

    const columns: TableProps<ICtk>['columns'] = [
        {
            title: 'Mã công trình', dataIndex: 'ma_ct', key: 'ma_ct',
            render: (_, record) => (
                <Space>
                    <Typography.Text copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.ma_ct}</Typography.Text>
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
                            title="Xóa công trình này?"
                            description={`Bạn thực sự muốn xóa "${record.ten_ct}"`}
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
                </Space>)
        },
        {
            title: 'Tên công trình',
            dataIndex: 'ten_ct',
            key: 'ten_ct',
        },
        { title: 'Loại công trình', key: 'loaicongtrinhcsvc', render: (_, record) => record.loaicongtrinhcsvc?.name ?? '' },
        { title: 'Mục đích sử dụng', key: 'mucdichsudungcsvc', render: (_, record) => record.mucdichsudungcsvc?.name ?? '' },
        { title: 'Đối tượng SD', dataIndex: 'doi_tuong_sd', key: 'doi_tuong_sd' },
        { title: 'DT xây dựng (m²)', dataIndex: 'dt_sxd', key: 'dt_sxd' },
        { title: 'Vốn ban đầu', dataIndex: 'von_bd', key: 'von_bd' },
        { title: 'Tình trạng CSVC', key: 'tinhtrangcsvc', render: (_, record) => record.tinhtrangcsvc?.name ?? '' },
        { title: 'Hình thức sở hữu', key: 'htsh', render: (_, record) => record.htsh?.name ?? '' },
        { title: 'Năm sử dụng', dataIndex: 'nam_sd', key: 'nam_sd' },
        { title: 'Tình trạng SD', key: 'tinh_trang_sd', render: (_, record) => record.tinh_trang_sd?.name ?? '' },
        { title: 'Địa chỉ', dataIndex: 'diachi', key: 'diachi' },
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedMa) params.set('ma_ct', selectedMa);
        if (selectedName) params.set('ten_ct', selectedName);
        if (selectedLoai) params.set('loaicongtrinhcsvc', selectedLoai);
        if (selectedMucDich) params.set('mucdichsudungcsvc', selectedMucDich);
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/ctk?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedMa) params.set('ma_ct', selectedMa);
        if (selectedName) params.set('ten_ct', selectedName);
        if (selectedLoai) params.set('loaicongtrinhcsvc', selectedLoai);
        if (selectedMucDich) params.set('mucdichsudungcsvc', selectedMucDich);
        params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        router.push(`/quan-tri/csvc/ctk?${params.toString()}`);
    };

    const clearFilter = () => {
        setSelectedMa(undefined);
        setSelectedName(undefined);
        setSelectedLoai(undefined);
        setSelectedMucDich(undefined);
    }

    const deleteMany = async (ids: string[]) => {
        const res = await handleDeleteCtkMany(ids, access_token);
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
    const rowSelection: TableRowSelection<ICtk> = { selectedRowKeys, onChange: onSelectChange };

    const headers = [
        { label: 'Mã công trình', key: 'ma_ct' },
        { label: 'Tên công trình', key: 'ten_ct' },
        { label: 'Loại công trình', key: 'loaicongtrinhcsvc.name' },
        { label: 'Mục đích sử dụng', key: 'mucdichsudungcsvc.name' },
        { label: 'Đối tượng sử dụng', key: 'doi_tuong_sd' },
        { label: 'DT xây dựng (m²)', key: 'dt_sxd' },
        { label: 'Vốn ban đầu', key: 'von_bd' },
        { label: 'Vốn đầu tư', key: 'von_dt' },
        { label: 'Tình trạng CSVC', key: 'tinhtrangcsvc.name' },
        { label: 'Hình thức sở hữu', key: 'htsh.name' },
        { label: 'Công trình CSVC trong nhà', key: 'ct_csvc_trongnha.name' },
        { label: 'Năm sử dụng', key: 'nam_sd' },
        { label: 'Số phòng ở công vụ', key: 'so_phong_o_cong_vu_cho_cb_giangday' },
        { label: 'Số chỗ ở cho CB giảng dạy', key: 'so_cho_o_cho_cb_giangday' },
        { label: 'Tình trạng sử dụng', key: 'tinh_trang_sd.name' },
        { label: 'Địa chỉ', key: 'diachi' },
        { label: 'Ngày chuyển tình trạng', key: 'ngay_chuyen_tt' },
    ];

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify="space-between" align="center">
                <h2>Danh sách công trình CSVC</h2>
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
                            <CSVLink data={data} filename="ctk.csv" headers={headers} separator=";">Export</CSVLink>
                        </Button>
                    )}
                    {canCreateCsvc(user ?? {} as IUser) && (
                        <Button onClick={() => { setStatus('CREATE'); setIsModalOpen(true); }} type="primary" icon={<FolderAddOutlined />}>Thêm mới</Button>
                    )}
                </div>
            </Flex>
            {canReadCsvc(user ?? {} as IUser) && (
                <Space style={{ marginBottom: 16 }} wrap>
                    <Input allowClear placeholder="Tìm theo mã công trình" onChange={(e) => setSelectedMa(e.target.value)} value={selectedMa} />
                    <Input allowClear placeholder="Tìm theo tên công trình" onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />
                    <Select
                        allowClear
                        onClear={() => setSelectedLoai(undefined)}
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Loại công trình"
                        style={{ minWidth: 200 }}
                        value={selectedLoai}
                        onChange={(val) => setSelectedLoai(val)}
                        options={loaicongtrinhcsvc.map(i => ({ value: i._id, label: i.name }))}
                    />
                    <Select
                        allowClear
                        onClear={() => setSelectedMucDich(undefined)}
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Mục đích sử dụng"
                        style={{ minWidth: 200 }}
                        value={selectedMucDich}
                        onChange={(val) => setSelectedMucDich(val)}
                        options={mucdichsudungcsvc.map(i => ({ value: i._id, label: i.name }))}
                    />
                    <Button icon={<ClearOutlined />} onClick={clearFilter}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <Table<ICtk>
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
            <CtkModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                loaicongtrinhcsvc={loaicongtrinhcsvc}
                mucdichsudungcsvc={mucdichsudungcsvc}
                tinhtrangcsvc={tinhtrangcsvc}
                hinhthucsohuu={hinhthucsohuu}
                luachon={luachon}
                tinhtrangsudung={tinhtrangsudung}
            />
            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
            />
            <Drawer
                title="Chi tiết Công trình CSVC"
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
                <CtkDetail data={selectedRecord} />
            </Drawer>
        </Context.Provider>
    );
};

export default TableCtk;
