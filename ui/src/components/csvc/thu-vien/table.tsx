'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Input, Popconfirm, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeleteThuvien, handleDeleteThuvienMany } from '@/app/(main)/quan-tri/csvc/thu-vien/actions';
import ThuvienModal from '@/components/csvc/thu-vien/modal';
import ModalImport from '@/components/csvc/thu-vien/modal.import';
import { canCreateCsvc, canDeleteCsvc, canReadCsvc, canUpdateCsvc } from '@/libs/csvc';
import { CSVLink } from 'react-csv';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: IThuvien[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
    tinhtrangcsvc: ITinhtrangcsvc[];
    hinhthucsohuu: IHinhthucsohuu[];
    tinhtrangsudung: ITinhtrangsudung[];
}

const Context = React.createContext({ name: 'Default' });

const TableThuvien = (props: IProps) => {
    const { data, access_token, meta, user, tinhtrangcsvc, hinhthucsohuu, tinhtrangsudung } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | IThuvien>(null);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const deleteItem = async (_id: string) => {
        const res = await handleDeleteThuvien(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const cancel: PopconfirmProps['onCancel'] = () => { };

    const columns: TableProps<IThuvien>['columns'] = [
        { title: 'Mã thư viện', dataIndex: 'ma_thuvien', key: 'ma_thuvien' },
        {
            title: 'Tên thư viện',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <Typography.Text>{record.name}</Typography.Text>
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
                            title="Xóa thư viện này?"
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
        { title: 'Diện tích (m²)', dataIndex: 'dt', key: 'dt' },
        { title: 'DT phòng đọc (m²)', dataIndex: 'dt_phongdoc', key: 'dt_phongdoc' },
        { title: 'Số phòng đọc', dataIndex: 'so_phong_doc', key: 'so_phong_doc' },
        { title: 'SL máy tính', dataIndex: 'soluong_maytinh', key: 'soluong_maytinh' },
        { title: 'SL chỗ ngồi đọc sách', dataIndex: 'soluong_cho_ngoi_doc_sach', key: 'soluong_cho_ngoi_doc_sach' },
        { title: 'SL sách', dataIndex: 'soluong_sach', key: 'soluong_sach' },
        { title: 'SL tạp chí', dataIndex: 'soluong_tapchi', key: 'soluong_tapchi' },
        { title: 'SL sách điện tử', dataIndex: 'soluong_sach_dien_tu', key: 'soluong_sach_dien_tu' },
        { title: 'Tình trạng CSVC', key: 'tinhtrangcsvc', render: (_, record) => record.tinhtrangcsvc?.name ?? '' },
        { title: 'Hình thức sở hữu', key: 'htsh', render: (_, record) => record.htsh?.name ?? '' },
        { title: 'Năm sử dụng', dataIndex: 'nam_sd', key: 'nam_sd' },
        { title: 'Tình trạng SD', key: 'tinh_trang_sd', render: (_, record) => record.tinh_trang_sd?.name ?? '' },
        { title: 'Địa chỉ', dataIndex: 'diachi', key: 'diachi' },
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/thu-vien?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedName) params.set('name', selectedName);
        params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        router.push(`/quan-tri/csvc/thu-vien?${params.toString()}`);
    };

    const deleteMany = async (ids: string[]) => {
        const res = await handleDeleteThuvienMany(ids, access_token);
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
    const rowSelection: TableRowSelection<IThuvien> = { selectedRowKeys, onChange: onSelectChange };

    const headers = [
        { label: 'Mã thư viện', key: 'ma_thuvien' },
        { label: 'Tên thư viện', key: 'name' },
        { label: 'Năm sử dụng', key: 'nam_sd' },
        { label: 'Diện tích (m²)', key: 'dt' },
        { label: 'DT phòng đọc (m²)', key: 'dt_phongdoc' },
        { label: 'Số phòng đọc', key: 'so_phong_doc' },
        { label: 'SL máy tính', key: 'soluong_maytinh' },
        { label: 'SL chỗ ngồi đọc sách', key: 'soluong_cho_ngoi_doc_sach' },
        { label: 'SL sách', key: 'soluong_sach' },
        { label: 'SL tạp chí', key: 'soluong_tapchi' },
        { label: 'Địa chỉ', key: 'diachi' },
    ];

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify="space-between" align="center">
                <h2>Danh sách thư viện</h2>
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
                            <CSVLink data={data} filename="thu-vien.csv" headers={headers} separator=";">Export</CSVLink>
                        </Button>
                    )}
                    {canCreateCsvc(user ?? {} as IUser) && (
                        <Button onClick={() => { setStatus('CREATE'); setIsModalOpen(true); }} type="primary" icon={<FolderAddOutlined />}>Thêm mới</Button>
                    )}
                </div>
            </Flex>
            {canReadCsvc(user ?? {} as IUser) && (
                <Space style={{ marginBottom: 16 }}>
                    <Input allowClear placeholder="Tìm theo tên thư viện" onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />
                    <Button icon={<ClearOutlined />} onClick={() => setSelectedName(undefined)}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <Table<IThuvien>
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
            <ThuvienModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                tinhtrangcsvc={tinhtrangcsvc}
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

export default TableThuvien;
