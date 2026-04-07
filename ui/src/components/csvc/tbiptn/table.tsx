'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Input, Popconfirm, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
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
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const deleteItem = async (_id: string) => {
        const res = await handleDeleteTbiptn(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const cancel: PopconfirmProps['onCancel'] = () => {};

    const columns: TableProps<ITbiptn>['columns'] = [
        { title: 'Mã thiết bị', dataIndex: 'ma_tb', key: 'ma_tb' },
        {
            title: 'Tên thiết bị',
            dataIndex: 'ten_tb',
            key: 'ten_tb',
            render: (_, record) => (
                <Space>
                    <Typography.Text>{record.ten_tb}</Typography.Text>
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
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/tbiptn?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedName) params.set('ten_tb', selectedName);
        params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        router.push(`/quan-tri/csvc/tbiptn?${params.toString()}`);
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
        { label: 'Năm sản xuất', key: 'nam_sx' },
        { label: 'Hãng sản xuất', key: 'hang_sx' },
        { label: 'SL cùng loại', key: 'sl_tb_cungloai' },
        { label: 'Năm sử dụng', key: 'nam_sd' },
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
                    <Input allowClear placeholder="Tìm theo tên thiết bị" onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />
                    <Button icon={<ClearOutlined />} onClick={() => setSelectedName(undefined)}>Xóa bộ lọc</Button>
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
        </Context.Provider>
    );
};

export default TableTbiptn;
