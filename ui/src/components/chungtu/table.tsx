'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Input, InputNumber, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography, message, notification } from 'antd';
import type { TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeleteChungtu, handleDeleteChungtuMany, handleExportChungtu } from '@/app/(main)/quan-tri/chung-tu/actions';
import { canCreateChungtu, canDeleteChungtu, canReadChungtu, canUpdateChungtu } from '@/libs/chungtu';
import ChungtuModal, { statusChungtuArray } from '@/components/chungtu/modal';
import { formatMoney } from '@/components/thietbiv2/device.detail';
import ModalImport from '@/components/chungtu/modal.import';
import dayjs from 'dayjs';
import ModalExport from '@/components/chungtu/modal.export';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface IProps {
    chungtu: IChungtu[],
    access_token: string,
    meta: IMeta,
    user: IUser | null,
    ncc: IUnit[],
}
export const STATUS_COLOR_MAP: Record<string, string> = {
    'Chưa xác định': 'green',
    'Đã thanh toán nhưng chưa scan': 'red',
    'Đã thanh toán': 'blue',
    'Thanh toán một phần': 'cyan',
};
export const STATUS_LABEL_MAP: Record<string, string> = {
    'Chưa xác định': 'Chưa xác định',
    'Đã thanh toán nhưng chưa scan': 'Đã thanh toán nhưng chưa scan',
    'Đã thanh toán': 'Đã thanh toán',
    'Thanh toán một phần': 'Thanh toán một phần',
};

const Context = React.createContext({ name: 'Default' });

const TableChungtu = (props: IProps) => {
    const { chungtu, access_token, meta, user, ncc } = props
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalImportOpen, setIsModalImportOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isModalExportOpen, SetIsModalExportOpen] = useState(false)

    const [status, setStatus] = useState('')
    const [dataUpdate, setDataUpdate] = useState<null | IChungtu>(null)
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [sotien, setSotien] = useState<number | undefined>(undefined);
    const [noidung, setNoidung] = useState<string | undefined>(undefined);
    const [selectedNcc, setSelectedNcc] = useState<string | undefined>(undefined);
    const [selectedTrangthai, setSelectedTrangthai] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const showModal = () => {
        setStatus("CREATE")
        setIsModalOpen(true);
    }
    const showModalImport = () => {
        setIsModalImportOpen(true);
    }

    const deleteChungtu = async (_id: string) => {
        const res = await handleDeleteChungtu(_id, access_token)
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

    const deleteChungtuMany = async (ids: string[]) => {
        const res = await handleDeleteChungtuMany(ids, access_token)
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

    const columns: TableProps<IChungtu>['columns'] = [
        {
            title: 'Ngày nhận CT',
            dataIndex: 'ngaynhan',
            key: 'ngaynhan',
            render: (_, record) => (
                <Space>
                    <Typography.Text copyable={{ text: record._id, tooltips: 'Sao chép' }}>{dayjs(record.ngaynhan).format('DD/MM/YYYY')}</Typography.Text>
                    {canUpdateChungtu(user ?? {} as IUser) && (
                        <Tooltip title="Cập nhật">
                            <EditOutlined style={{ color: '#1cc03d', cursor: 'pointer' }}
                                onClick={() => { setDataUpdate(record); setStatus('UPDATE'); setIsModalOpen(true); }} />
                        </Tooltip>
                    )}
                    {canDeleteChungtu(user ?? {} as IUser) && (
                        <Popconfirm title="Xóa chứng từ này?" description={`Bạn thực sự muốn xóa`}
                            onConfirm={() => deleteChungtu(record._id)} okText="Đồng ý" cancelText="Hủy" placement="rightBottom">
                            <Tooltip title="Xóa"><DeleteOutlined style={{ color: '#f12929', cursor: 'pointer' }} /></Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
        {
            title: 'Nội dung',
            dataIndex: 'noidung',
            key: 'noidung',
            render: (_, record) => (
                <Space style={{ maxWidth: 250, display: 'inline-block', }}>
                    <Typography.Text ellipsis={{ tooltip: record.noidung }} >
                        {record.noidung}
                    </Typography.Text>
                </Space>
            )
        },
        {
            title: 'Ngày hoàn thành CT',
            dataIndex: 'ngayhoanthanh',
            key: 'ngayhoanthanh',
            render: (_, record) => (
                <Typography.Text >{record?.ngayhoanthanh ? dayjs(record?.ngayhoanthanh).format('DD/MM/YYYY') : '-'}</Typography.Text>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangthai',
            key: 'trangthai',
            render: (_, record) => (
                <Tag color={STATUS_COLOR_MAP[record.trangthai!] || 'default'} variant='outlined'>
                    {STATUS_LABEL_MAP[record.trangthai!] || record.trangthai}
                </Tag>
            )
        },
        {
            title: 'Số tiền',
            dataIndex: 'sotien',
            key: 'sotien',
            render: (_, record) => {
                return formatMoney(record.sotien)
            }
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghichu',
            key: 'ghichu',
            render: (_, record) => {
                return record?.ghichu ?? '-'
            }
        },
        {
            title: 'Người tạo',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) => {
                return record?.user?.name ?? '-'
            }
        },
        {
            title: 'Người cập nhật',
            dataIndex: 'updatedBy',
            key: 'updatedBy',
            render: (_, record) => {
                return record?.updatedBy?.name ?? '-'
            }
        },
        {
            title: 'Nhà cung cấp',
            dataIndex: 'ncc',
            key: 'ncc',
            render: (_, record) => {
                return <Typography.Text copyable={{ text: record.ncc?._id, tooltips: 'Sao chép' }}>{record?.ncc?.name ?? '-'}</Typography.Text>
            }
        }
    ];
    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams()

        if (sotien) params.set('sotien', sotien.toString())
        if (noidung) params.set('noidung', noidung)
        if (selectedTrangthai) params.set('trangthai', selectedTrangthai)
        if (selectedNcc) params.set('ncc', selectedNcc)

        params.set('current', current.toString())
        params.set('pageSize', pageSize.toString())
        router.push(`/quan-tri/chung-tu?${params.toString()}`);
    };
    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            deleteChungtuMany(selectedRowKeys as string[])
            setSelectedRowKeys([])
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection: TableRowSelection<IChungtu> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const showModalExport = () => {
        SetIsModalExportOpen(true);
    }

    // Hàm xóa bộ lọc
    const handleClear = () => {
        setSotien(undefined)
        setNoidung(undefined)
        setSelectedTrangthai(undefined)
        setSelectedNcc(undefined)
    };
    const handleFilter = () => {
        const params = new URLSearchParams()
        if (sotien) params.set('sotien', sotien.toString())
        if (noidung) params.set('noidung', noidung)
        if (selectedTrangthai) params.set('trangthai', selectedTrangthai)
        if (selectedNcc) params.set('ncc', selectedNcc)

        params.set('current', '1')
        params.set('pageSize', meta.pageSize.toString())

        router.push(`/quan-tri/chung-tu?${params.toString()}`)
    }
    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex wrap style={{ marginBottom: 16, gap: 8 }} justify='space-between' align='center'>
                <h2>Danh sách chứng từ</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canDeleteChungtu(user ?? {} as IUser) && (<Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>Xóa {selectedRowKeys.length !== 0 && `(${selectedRowKeys.length})`}</Button>)}
                    {canCreateChungtu(user ?? {} as IUser) && (<Button onClick={showModalImport} type='primary' icon={<CloudUploadOutlined />}>Import</Button>)}
                    {canReadChungtu(user ?? {} as IUser) && mounted && (
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={showModalExport}>
                            Export
                        </Button>
                    )}
                    {canCreateChungtu(user ?? {} as IUser) && (<Button onClick={showModal} type='primary' icon={<FolderAddOutlined />}>Thêm mới</Button>)}
                </div>
            </Flex>
            {canReadChungtu(user ?? {} as IUser) && (<Space wrap style={{ marginBottom: 16 }}>
                <InputNumber style={{ width: 'auto' }} placeholder="Tìm theo số tiền"
                    onChange={(value) => setSotien(value ?? undefined)} value={sotien} />
                <Input allowClear placeholder="Tìm theo nội dung"
                    onChange={(e) => setNoidung(e.target.value)} value={noidung} />
                <Select
                    style={{ width: '100%' }}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn trạng thái"
                    // 🔥 Gán value từ state vào đây
                    value={selectedTrangthai}
                    onChange={(e) => setSelectedTrangthai(e)}
                    allowClear
                    options={statusChungtuArray}
                />
                <Select
                    style={{ width: '100%' }}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn nhà cung cấp"
                    // 🔥 Gán value từ state vào đây
                    value={selectedNcc}
                    onChange={(e) => setSelectedNcc(e)}
                    allowClear
                    options={
                        ncc && ncc.length > 0
                            ? ncc.map(({ _id, name }) => ({
                                value: _id,
                                label: name
                            }))
                            : []
                    }
                />
                <Button icon={<ClearOutlined />} onClick={handleClear}>Xóa bộ lọc</Button>
                <Button icon={<SearchOutlined />} type='primary' onClick={handleFilter}>Lọc</Button>
            </Space>)}
            <Table<IChungtu>
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
                columns={columns} dataSource={chungtu} rowKey={"_id"} />
            <ChungtuModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                ncc={ncc}
                setIsModalOpen={setIsModalOpen}
                //update info
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
            <ModalExport
                access_token={access_token}
                isModalExportOpen={isModalExportOpen}
                setIsModalExportOpen={SetIsModalExportOpen}
            />
            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
            />
        </Context.Provider>
    )
}

export default TableChungtu;