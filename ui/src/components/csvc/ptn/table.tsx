'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeletePtn, handleDeletePtnMany } from '@/app/(main)/quan-tri/csvc/ptn/actions';
import PtnModal from '@/components/csvc/ptn/modal';
import ModalImport from '@/components/csvc/ptn/modal.import';
import { canCreateCsvc, canDeleteCsvc, canReadCsvc, canUpdateCsvc } from '@/libs/csvc';
import { CSVLink } from 'react-csv';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    data: IPtn[];
    access_token: string;
    meta: IMeta;
    user: IUser | null;
    ctk: ICtk[];
    loaiptn: ILoaiptn[];
    linhvucdaotao: ILinhvucdaotao[];
}

const Context = React.createContext({ name: 'Default' });

const TablePtn = (props: IProps) => {
    const { data, access_token, meta, user, ctk, loaiptn, linhvucdaotao } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | IPtn>(null);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [selectedLoaiPtn, setSelectedLoaiPtn] = useState<string | undefined>(undefined);
    const [selectedMaCt, setSelectedMaCt] = useState<string | undefined>(undefined);
    const [selectedPhucVuNganh, setSelectedPhucVuNganh] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const deleteItem = async (_id: string) => {
        const res = await handleDeletePtn(_id, access_token);
        if (!res.data) api.error({ title: 'Có lỗi xảy ra', description: res.message, placement: 'topRight' });
        else messageApi.success(res.message);
    };

    const cancel: PopconfirmProps['onCancel'] = () => { };

    const columns: TableProps<IPtn>['columns'] = [
        {
            title: 'Công trình CSVC',
            key: 'ma_ct_csvc',
            render: (_, record) => (
                <Space>
                    <Typography.Text copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.ma_ct_csvc?.ten_ct ?? ''}</Typography.Text>
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
                            title="Xóa phòng thí nghiệm này?"
                            description={`Bạn thực sự muốn xóa bản ghi này?`}
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
        { title: 'Loại PTN', key: 'loai_ptn', render: (_, record) => record.loai_ptn?.name ?? '' },
        { title: 'Phục vụ ngành', key: 'phuc_vu_nganh', render: (_, record) => record.phuc_vu_nganh?.name ?? '' },
        { title: 'Mức độ đáp ứng nhu cầu NCKH', dataIndex: 'muc_do_dap_ung_nhu_cau_nckh', key: 'muc_do_dap_ung_nhu_cau_nckh' },
        { title: 'Năm sử dụng', dataIndex: 'nam_sd', key: 'nam_sd' },
    ];

    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams();
        if (selectedLoaiPtn) params.set('loai_ptn', selectedLoaiPtn);
        if (selectedMaCt) params.set('ma_ct_csvc', selectedMaCt);
        if (selectedPhucVuNganh) params.set('phuc_vu_nganh', selectedPhucVuNganh);
        params.set('current', current.toString());
        params.set('pageSize', pageSize.toString());
        router.push(`/quan-tri/csvc/ptn?${params.toString()}`);
    };

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (selectedLoaiPtn) params.set('loai_ptn', selectedLoaiPtn);
        if (selectedMaCt) params.set('ma_ct_csvc', selectedMaCt);
        if (selectedPhucVuNganh) params.set('phuc_vu_nganh', selectedPhucVuNganh);
        params.set('current', '1');
        params.set('pageSize', meta.pageSize.toString());
        router.push(`/quan-tri/csvc/ptn?${params.toString()}`);
    };
    const clearFilter = () => {
        setSelectedLoaiPtn(undefined);
        setSelectedMaCt(undefined);
        setSelectedPhucVuNganh(undefined);
    }

    const deleteMany = async (ids: string[]) => {
        const res = await handleDeletePtnMany(ids, access_token);
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
    const rowSelection: TableRowSelection<IPtn> = { selectedRowKeys, onChange: onSelectChange };

    const headers = [
        { label: 'Mức độ đáp ứng NCKH', key: 'muc_do_dap_ung_nhu_cau_nckh' },
        { label: 'Năm sử dụng', key: 'nam_sd' },
    ];

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify="space-between" align="center">
                <h2>Danh sách phòng thí nghiệm</h2>
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
                            <CSVLink data={data} filename="ptn.csv" headers={headers} separator=";">Export</CSVLink>
                        </Button>
                    )}
                    {canCreateCsvc(user ?? {} as IUser) && (
                        <Button onClick={() => { setStatus('CREATE'); setIsModalOpen(true); }} type="primary" icon={<FolderAddOutlined />}>Thêm mới</Button>
                    )}
                </div>
            </Flex>
            {canReadCsvc(user ?? {} as IUser) && (
                <Space style={{ marginBottom: 16 }}>
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
                    <Select
                        allowClear
                        onClear={() => setSelectedLoaiPtn(undefined)}
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Loại PTN"
                        style={{ minWidth: 200 }}
                        value={selectedLoaiPtn}
                        onChange={(val) => setSelectedLoaiPtn(val)}
                        options={loaiptn.map(i => ({ value: i._id, label: i.name }))}
                    />

                    <Select
                        allowClear
                        onClear={() => setSelectedPhucVuNganh(undefined)}
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Phục vụ ngành"
                        style={{ minWidth: 200 }}
                        value={selectedPhucVuNganh}
                        onChange={(val) => setSelectedPhucVuNganh(val)}
                        options={linhvucdaotao.map(i => ({ value: i._id, label: i.name }))}
                    />
                    <Button icon={<ClearOutlined />} onClick={clearFilter}>Xóa bộ lọc</Button>
                    <Button icon={<SearchOutlined />} type="primary" onClick={handleFilter}>Lọc</Button>
                </Space>
            )}
            <Table<IPtn>
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
            <PtnModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                ctk={ctk}
                loaiptn={loaiptn}
                linhvucdaotao={linhvucdaotao}
            />
            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
            />
        </Context.Provider>
    );
};

export default TablePtn;
