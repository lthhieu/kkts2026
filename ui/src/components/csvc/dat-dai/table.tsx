'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Input, Popconfirm, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeleteDatdai, handleDeleteDatdaiMany } from '@/app/(main)/quan-tri/csvc/dat-dai/actions';
import DatdaiModal from '@/components/csvc/dat-dai/modal';
import ModalImport from '@/components/csvc/dat-dai/modal.import';
import { canCreateCsvc, canDeleteCsvc, canReadCsvc, canUpdateCsvc } from '@/libs/csvc';
import { CSVLink } from 'react-csv';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: IDatdai[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
    hinhthucsudung: IHinhthucsudung[];
    mucdichsudungdat: IMucdichsudungdat[];
    tinhtrangsudung: ITinhtrangsudung[];
    tinhthanhpho: ITinhthanhpho[];
    xaphuong: IXaphuong[];
}

const Context = React.createContext({ name: 'Default' });

const TableDatdai = (props: IProps) => {
    const { data, access_token, meta, user, hinhthucsudung, mucdichsudungdat, tinhtrangsudung, tinhthanhpho, xaphuong } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | IDatdai>(null);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

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
                    <Typography.Text ellipsis copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.ma_giay_cnqsh}</Typography.Text>
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
        { title: 'Diện tích (m²)', dataIndex: 'dt', key: 'dt' },
        { title: 'Hình thức sử dụng', key: 'htsd', render: (_, record) => record.htsd?.name ?? '' },
        { title: 'Cơ quan sở hữu', dataIndex: 'cqsh', key: 'cqsh' },
        { title: 'Mục đích SHD', key: 'muc_dich_shd', render: (_, record) => record.muc_dich_shd?.name ?? '' },
        { title: 'Năm bắt đầu SDD', dataIndex: 'nam_bd_sdd', key: 'nam_bd_sdd' },
        { title: 'Thời gian SDD (năm)', dataIndex: 'tg_sdd', key: 'tg_sdd' },
        { title: 'Diện tích đã SD (m²)', dataIndex: 'dtd_da_sd', key: 'dtd_da_sd' },
        { title: 'Tình trạng SD', key: 'tinh_trang_sd', render: (_, record) => record.tinh_trang_sd?.name ?? '' },
        { title: 'Tỉnh / Thành phố', key: 'tinhthanhpho', render: (_, record) => record.tinhthanhpho?.name ?? '' },
        { title: 'Xã / Phường', key: 'xaphuong', render: (_, record) => record.xaphuong?.name ?? '' },
        { title: 'Địa chỉ', dataIndex: 'diachi', key: 'diachi' },
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

    const headers = [
        { label: 'Mã giấy CNQSH', key: 'ma_giay_cnqsh' },
        { label: 'Diện tích (m²)', key: 'dt' },
        { label: 'Cơ quan sở hữu', key: 'cqsh' },
        { label: 'Minh chứng QSHD', key: 'minh_chung_qshd' },
        { label: 'Năm bắt đầu SDD', key: 'nam_bd_sdd' },
        { label: 'Thời gian SDD', key: 'tg_sdd' },
        { label: 'Diện tích đã SD', key: 'dtd_da_sd' },
        { label: 'Địa chỉ', key: 'diachi' },
        { label: 'Ngày chuyển tình trạng', key: 'ngay_chuyen_tt' },
    ];

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify="space-between" align="center">
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
                        <Button type="primary" icon={<CloudDownloadOutlined />}>
                            <CSVLink data={data} filename="dat-dai.csv" headers={headers} separator=";">Export</CSVLink>
                        </Button>
                    )}
                    {canCreateCsvc(user ?? {} as IUser) && (
                        <Button onClick={() => { setStatus('CREATE'); setIsModalOpen(true); }} type="primary" icon={<FolderAddOutlined />}>Thêm mới</Button>
                    )}
                </div>
            </Flex>
            {canReadCsvc(user ?? {} as IUser) && (
                <Space style={{ marginBottom: 16 }}>
                    <Input allowClear placeholder="Tìm theo mã giấy CNQSH" onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />
                    <Button icon={<ClearOutlined />} onClick={() => setSelectedName(undefined)}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
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
                hinhthucsudung={hinhthucsudung}
                mucdichsudungdat={mucdichsudungdat}
                tinhtrangsudung={tinhtrangsudung}
                tinhthanhpho={tinhthanhpho}
                xaphuong={xaphuong}
            />
            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
            />
        </Context.Provider>
    );
};

export default TableDatdai;
