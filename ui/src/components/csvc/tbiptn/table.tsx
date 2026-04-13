'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Flex, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import TbiptnDetail from '@/components/csvc/tbiptn/detail';
import { useRouter } from 'next/navigation';
import { handleDeleteTbiptn, handleDeleteTbiptnMany } from '@/app/(main)/quan-tri/csvc/tbiptn/actions';
import TbiptnModal from '@/components/csvc/tbiptn/modal';
import ModalImport from '@/components/csvc/tbiptn/modal.import';
import { canCreateCsvc, canDeleteCsvc, canReadCsvc, canUpdateCsvc } from '@/libs/csvc';
import { CSVLink } from 'react-csv';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: ITbiptn[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
    ctk: ICtk[];
    countries: ICountry[];
    tinhtrangsudung: ITinhtrangsudung[];
}

const Context = React.createContext({ name: 'Default' });

const TableTbiptn = (props: IProps) => {
    const { data, access_token, meta, user, ctk, countries, tinhtrangsudung } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | ITbiptn>(null);
    const [selectedRecord, setSelectedRecord] = useState<null | ITbiptn>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [selectedMaCt, setSelectedMaCt] = useState<string | undefined>(undefined);
    const [selectedMaTB, setSelectedMaTB] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const showDrawer = (record: ITbiptn) => { setSelectedRecord(record); setOpenDrawer(true); };
    const onClose = () => setOpenDrawer(false);

    const deleteItem = async (_id: string) => {
        const res = await handleDeleteTbiptn(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const cancel: PopconfirmProps['onCancel'] = () => { };

    const columns: TableProps<ITbiptn>['columns'] = [
        {
            title: 'Mã thiết bị', dataIndex: 'ma_tb', key: 'ma_tb',
            render: (_, record) => (
                <Space style={{ maxWidth: 300 }}>
                    <Typography.Text ellipsis copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.ten_tb}</Typography.Text>
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
                            title="Xóa thiết bị này?"
                            description={`Bạn thực sự muốn xóa "${record.ten_tb}"`}
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
            title: 'Tên thiết bị',
            dataIndex: 'ten_tb',
            key: 'ten_tb',
            render: (_, record) => (
                <Space style={{ maxWidth: 300 }}>
                    <Typography.Text ellipsis copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.ten_tb}</Typography.Text>
                </Space>
            ),
        },
        { title: 'Công trình CSVC', key: 'ma_ct_csvc', render: (_, record) => record.ma_ct_csvc?.ten_ct ?? '' },
        { title: 'Năm sản xuất', dataIndex: 'nam_sx', key: 'nam_sx' },
        { title: 'Xuất xứ', key: 'xuatxu', render: (_, record) => record.xuatxu?.name ?? '' },
        { title: 'Hãng sản xuất', dataIndex: 'hang_sx', key: 'hang_sx' },
        { title: 'SL thiết bị cùng loại', dataIndex: 'sl_tb_cungloai', key: 'sl_tb_cungloai' },
        { title: 'Năm sử dụng', dataIndex: 'nam_sd', key: 'nam_sd' },
        { title: 'Tình trạng SD', key: 'tinh_trang_sd', render: (_, record) => record.tinh_trang_sd?.name ?? '' },
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedName) params.set('ten_tb', selectedName);
        if (selectedMaCt) params.set('ma_ct_csvc', selectedMaCt);
        if (selectedMaTB) params.set('ma_tb', selectedMaTB);
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/tbiptn?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedName) params.set('ten_tb', selectedName);
        if (selectedMaCt) params.set('ma_ct_csvc', selectedMaCt);
        if (selectedMaTB) params.set('ma_tb', selectedMaTB);
        params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        router.push(`/quan-tri/csvc/tbiptn?${params.toString()}`);
    };

    const clearFilter = () => {
        setSelectedName(undefined);
        setSelectedMaCt(undefined);
        setSelectedMaTB(undefined);
    };

    const deleteMany = async (ids: string[]) => {
        const res = await handleDeleteTbiptnMany(ids, access_token);
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
    const rowSelection: TableRowSelection<ITbiptn> = { selectedRowKeys, onChange: onSelectChange };

    const headers = [
        { label: 'Mã thiết bị', key: 'ma_tb' },
        { label: 'Tên thiết bị', key: 'ten_tb' },
        { label: 'Công trình CSVC', key: 'ma_ct_csvc.ten_ct' },
        { label: 'Năm sản xuất', key: 'nam_sx' },
        { label: 'Xuất xứ', key: 'xuatxu.name' },
        { label: 'Hãng sản xuất', key: 'hang_sx' },
        { label: 'SL cùng loại', key: 'sl_tb_cungloai' },
        { label: 'Năm sử dụng', key: 'nam_sd' },
        { label: 'Tình trạng SD', key: 'tinh_trang_sd.name' },
        { label: 'Ngày chuyển tình trạng', key: 'ngay_chuyen_tt' },
    ];

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify="space-between" align="center">
                <h2>Danh sách thiết bị PTN</h2>
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
                            <CSVLink data={data} filename="tbiptn.csv" headers={headers} separator=";">Export</CSVLink>
                        </Button>
                    )}
                    {canCreateCsvc(user ?? {} as IUser) && (
                        <Button onClick={() => { setStatus('CREATE'); setIsModalOpen(true); }} type="primary" icon={<FolderAddOutlined />}>Thêm mới</Button>
                    )}
                </div>
            </Flex>
            {canReadCsvc(user ?? {} as IUser) && (
                <Space style={{ marginBottom: 16 }}>
                    <Input allowClear placeholder="Tìm theo mã thiết bị" onChange={(e) => setSelectedMaTB(e.target.value)} value={selectedMaTB} />
                    <Input allowClear placeholder="Tìm theo tên thiết bị" onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />
                    <Select
                        allowClear
                        onClear={() => setSelectedMaCt(undefined)}
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Công trình CSVC"
                        style={{ minWidth: 200 }}
                        value={selectedMaCt}
                        onChange={(val) => setSelectedMaCt(val)}
                        options={ctk.map(i => ({ value: i._id, label: i.ten_ct }))}
                    />
                    <Button icon={<ClearOutlined />} onClick={clearFilter}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <Table<ITbiptn>
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
            <TbiptnModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                ctk={ctk}
                countries={countries}
                tinhtrangsudung={tinhtrangsudung}
            />
            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
            />
            <Drawer
                title="Chi tiết Thiết bị PTN"
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
                <TbiptnDetail data={selectedRecord} />
            </Drawer>
        </Context.Provider>
    );
};

export default TableTbiptn;
