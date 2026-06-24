'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Input, Popconfirm, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeleteNcc, handleDeleteNccMany, handleExportNcc } from '@/app/(main)/quan-tri/ncc/actions';
import { canCreateChungtu, canDeleteChungtu, canReadChungtu, canUpdateChungtu } from '@/libs/chungtu';
import NccModal from '@/components/ncc/modal';
import ModalImport from '@/components/ncc/modal.import';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    ncc: IUnit[],
    access_token: string,
    meta: IMeta,
    user: IUser | null
}

const Context = React.createContext({ name: 'Default' });

const TableNccs = (props: IProps) => {
    const { ncc, access_token, meta, user } = props
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalImportOpen, setIsModalImportOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [status, setStatus] = useState('')
    const [dataUpdate, setDataUpdate] = useState<null | IUnit>(null)
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const showModal = () => {
        setStatus("CREATE")
        setIsModalOpen(true);
    }
    const showModalImport = () => {
        setIsModalImportOpen(true);
    }
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // console.log(e);
    };

    const deleteNcc = async (_id: string) => {
        const res = await handleDeleteNcc(_id, access_token)
        if (!res.data) {
            api.error({
                title: `Có lỗi xảy ra`,
                description: res.message,
                placement: 'topRight',
            });
        }
        else {
            messageApi.success(res.message);
        }
    }

    const deleteNccMany = async (ids: string[]) => {
        const res = await handleDeleteNccMany(ids, access_token)
        if (!res.data) {
            api.error({
                title: `Có lỗi xảy ra`,
                description: res.message,
                placement: 'topRight',
            });
        }
        else {
            messageApi.success(res.message);
        }
    }

    const columns: TableProps<IUnit>['columns'] = [
        {
            title: 'Tên nhà cung cấp',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <Typography.Text copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.name}</Typography.Text>
                    {canUpdateChungtu(user ?? {} as IUser) && (
                        <Tooltip title="Cập nhật">
                            <EditOutlined style={{ color: '#1cc03d', cursor: 'pointer' }}
                                onClick={() => { setDataUpdate(record); setStatus('UPDATE'); setIsModalOpen(true); }} />
                        </Tooltip>
                    )}
                    {canDeleteChungtu(user ?? {} as IUser) && (
                        <Popconfirm title="Xóa đơn vị này?" description={`Bạn thực sự muốn xóa "${record.name}"`}
                            onConfirm={() => deleteNcc(record._id)} okText="Đồng ý" cancelText="Hủy" placement="rightBottom">
                            <Tooltip title="Xóa"><DeleteOutlined style={{ color: '#f12929', cursor: 'pointer' }} /></Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];
    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams()

        if (selectedName) params.set('name', selectedName)

        params.set('current', current.toString())
        params.set('pageSize', pageSize.toString())
        router.push(`/quan-tri/ncc?${params.toString()}`);
    };
    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            deleteNccMany(selectedRowKeys as string[])
            setSelectedRowKeys([])
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection: TableRowSelection<IUnit> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const handleExport = async () => {
        const blob = await handleExportNcc(access_token);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'ncc.csv';
        a.click();

        window.URL.revokeObjectURL(url);
    };

    // Hàm xóa bộ lọc
    const handleClear = () => {
        setSelectedName(undefined)
    };
    const handleFilter = () => {
        const params = new URLSearchParams()
        if (selectedName) params.set('name', selectedName)

        params.set('current', '1')
        params.set('pageSize', meta.pageSize.toString())

        router.push(`/quan-tri/ncc?${params.toString()}`)
    }
    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex wrap style={{ marginBottom: 16, gap: 8 }} justify='space-between' align='center'>
                <h2>Danh sách nhà cung cấp</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canDeleteChungtu(user ?? {} as IUser) && (<Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>Xóa {selectedRowKeys.length !== 0 && `(${selectedRowKeys.length})`}</Button>)}
                    {canCreateChungtu(user ?? {} as IUser) && (<Button onClick={showModalImport} type='primary' icon={<CloudUploadOutlined />}>Import</Button>)}
                    {canReadChungtu(user ?? {} as IUser) && mounted && (
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={handleExport}>
                            Export
                        </Button>
                    )}
                    {canCreateChungtu(user ?? {} as IUser) && (<Button onClick={showModal} type='primary' icon={<FolderAddOutlined />}>Thêm mới</Button>)}
                </div>
            </Flex>
            {canReadChungtu(user ?? {} as IUser) && (<Space wrap style={{ marginBottom: 16 }}>
                <Input allowClear placeholder="Tìm theo tên nhà cung cấp"
                    onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />

                <Button icon={<ClearOutlined />} onClick={handleClear}>Xóa bộ lọc</Button>
                <Button icon={<SearchOutlined />} type='primary' onClick={handleFilter}>Lọc</Button>
            </Space>)}
            <Table<IUnit>
                scroll={{ x: "max-content" }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kết quả`,
                    onChange: (page: number, pageSize: number) => handleOnChangePage(page, pageSize),
                    pageSizeOptions: [10, 20],
                    defaultPageSize: 10,
                    showSizeChanger: true,
                }}
                rowSelection={{ type: 'checkbox', ...rowSelection }}
                columns={columns} dataSource={ncc} rowKey={"_id"} />
            <NccModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                //update info
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
            />
        </Context.Provider>
    )
}

export default TableNccs;