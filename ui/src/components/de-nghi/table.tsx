'use client'
import React, { useMemo, useState } from 'react';
import { Button, Drawer, Flex, Grid, Input, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, EyeOutlined, DeleteOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { canCreateRequest, canDeleteRequest, canReadRequest, canUpdateRequest } from '@/libs/request';
import { handleDeleteRequest, handleDeleteRequestMany, handleGetRequestById } from '@/app/(main)/quan-tri/de-nghi/actions';
import RequestModal from '@/components/de-nghi/modal';
import RequestDetail from '@/components/de-nghi/request.detail';
import StatusRequestModal from '@/components/de-nghi/modal.status';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
const { useBreakpoint } = Grid;

interface IProps {
    requests: IRequestModule[],
    access_token: string,
    meta: IMeta,
    user: IUser | null,
    units: IUnit[] | null
}

export const STATUS_COLOR_MAP: Record<string, string> = {
    approved: 'green',
    pending: 'gold',
    confirmed: 'blue',
    reject: 'red'
};
export const STATUS_LABEL_MAP: Record<string, string> = {
    approved: 'Đã tiếp nhận',
    pending: 'Đang xử lý',
    confirmed: 'Hoàn thành',
    reject: 'Từ chối'
};

export const typeArr = [{ value: 'Hư hỏng', label: 'Hư hỏng' },
{ value: 'Thanh lý', label: 'Thanh lý' }
]

const Context = React.createContext({ name: 'Default' });

const TableRequests = (props: IProps) => {
    const { requests, access_token, meta, user, units } = props
    const [isModalOpen, SetIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | IRequestModule>(null)
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [dataExport, setDataExport] = useState<any[]>([])
    const screens = useBreakpoint();
    const isMobile = !screens.md;  // < 768px
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);
    const [selectedUnit, setSelectedUnit] = useState<string | undefined>(undefined);
    const [selectedEmail, setSelectedEmail] = useState<string | undefined>(undefined);
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<IRequestModule | null>(null)

    const showModal = () => {
        SetIsModalOpen(true);
    }
    const showStatusModal = () => {
        setStatusOpen(true);
        setDataUpdate(selectedRequest)
    }
    const confirm = (_id: string) => {
        deleteRequest(_id)
    };
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // console.log(e);
    };

    const showDrawer = (data: IRequestModule) => {
        setSelectedRequest(data)
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        setSelectedRequest(null)
    };

    const deleteRequest = async (_id: string) => {
        const res = await handleDeleteRequest(_id, access_token)
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

    const deleteRequestMany = async (ids: string[]) => {
        const res = await handleDeleteRequestMany(ids, access_token)
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

    const refreshSelectedRequest = async () => {
        if (!selectedRequest || !access_token) return;

        try {
            const res = await handleGetRequestById(selectedRequest._id, access_token);
            if (res.data) {
                setSelectedRequest(res.data); // Cập nhật state với dữ liệu mới nhất
            }
        } catch (error) {
            console.error("Refresh failed:", error);
        }
    };

    const columns: TableProps<IRequestModule>['columns'] = [
        {
            title: 'Tên đề nghị',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => <Space>
                <Typography.Text copyable={{ text: record._id }}>{record.name}</Typography.Text>
                {canReadRequest(user ?? {} as IUser) && (
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined
                            style={{ color: '#1890ff', cursor: 'pointer' }}
                            onClick={() => showDrawer(record)}
                        />
                    </Tooltip>
                )}

                {canDeleteRequest(user ?? {} as IUser) && (
                    <Popconfirm
                        title="Xóa đề nghị này?"
                        description={`Bạn thực sự muốn xóa đề nghị ${record.name}`}
                        onConfirm={() => confirm(record._id)}
                        onCancel={cancel}
                        okText="Đồng ý"
                        cancelText="Hủy"
                        placement='rightBottom'
                    >
                        <Tooltip title="Xóa">
                            <DeleteOutlined
                                style={{ color: '#f12929', cursor: 'pointer' }} />
                        </Tooltip>
                    </Popconfirm>


                )}
            </Space>
        },
        {
            title: 'Loại đề nghị',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <Tag color={STATUS_COLOR_MAP[record.status!] || 'default'} variant='outlined'>
                    {STATUS_LABEL_MAP[record.status!] || record.status}
                </Tag>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Người đề nghị',
            dataIndex: 'createdBy',
            key: 'createdBy',
        },
        {
            title: 'Đơn vị',
            dataIndex: ['unit', 'name'],
            key: 'unit',
            render: (_, record) => <Typography.Text copyable={{ text: record.unit?._id || "" }}>{record.unit?.name}</Typography.Text>
        },
    ];
    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams()

        if (selectedName) params.set('name', selectedName)
        if (selectedUnit) params.set('unit', selectedUnit)
        if (selectedEmail) params.set('createdBy', selectedEmail)
        if (selectedStatus) params.set('status', selectedStatus)
        if (selectedType) params.set('type', selectedType)

        params.set('current', current.toString())
        params.set('pageSize', pageSize.toString())
        router.push(`/quan-tri/de-nghi?${params.toString()}`);
    };
    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            deleteRequestMany(selectedRowKeys as string[])
            setSelectedRowKeys([])
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection: TableRowSelection<IRequestModule> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onChangeUnit = (value: string) => {
        setSelectedUnit(value);
    };
    // Hàm xử lý khi chọn status
    const onChangeStatus = (value: string) => {
        setSelectedStatus(value);
    };
    // Hàm xử lý khi chọn type
    const onChangeType = (value: string) => {
        setSelectedType(value);
    };

    // Hàm xóa bộ lọc
    const handleClear = () => {
        setSelectedName(undefined)
        setSelectedUnit(undefined)
        setSelectedEmail(undefined)
        setSelectedStatus(undefined)
        setSelectedType(undefined)
    };
    const handleFilter = () => {
        const params = new URLSearchParams()
        if (selectedName) params.set('name', selectedName)
        if (selectedUnit) params.set('unit', selectedUnit)
        if (selectedEmail) params.set('createdBy', selectedEmail)
        if (selectedStatus) params.set('status', selectedStatus)
        if (selectedType) params.set('type', selectedType)

        params.set('current', '1')
        params.set('pageSize', meta.pageSize.toString())

        router.push(`/quan-tri/de-nghi?${params.toString()}`)
    }
    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify='space-between'
                align={isMobile ? 'stretch' : 'center'}
                vertical={isMobile} gap={16}>
                <h2>Danh sách đề nghị</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canDeleteRequest(user ?? {} as IUser) && (<Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>Xóa {selectedRowKeys.length !== 0 && `(${selectedRowKeys.length})`}</Button>)}
                    {canCreateRequest(user ?? {} as IUser) && (<Button onClick={showModal} type='primary' icon={<FolderAddOutlined />}>Thêm mới</Button>)}
                </div>
            </Flex>
            {canReadRequest(user ?? {} as IUser) && (<Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                <Input allowClear placeholder="Tìm theo tên đề nghị"
                    onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />
                <Input allowClear placeholder="Tìm theo email"
                    onChange={(e) => setSelectedEmail(e.target.value)} value={selectedEmail} />


                {user?.role === 'gv' ? <></> : <Select
                    style={{ width: '100%' }}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn đơn vị"
                    // 🔥 Gán value từ state vào đây
                    value={selectedUnit}
                    onChange={onChangeUnit}
                    allowClear
                    options={
                        units && units.length > 0
                            ? units.map(({ _id, name }) => ({
                                value: _id,
                                label: name
                            }))
                            : []
                    }
                />}
                <Select
                    style={{ width: '100%' }}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn loại đề nghị"
                    // 🔥 Gán value từ state vào đây
                    value={selectedType}
                    onChange={onChangeType}
                    allowClear
                    options={typeArr}
                />
                <Select
                    style={{ width: '100%' }}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn trạng thái đề nghị"
                    value={selectedStatus}
                    onChange={onChangeStatus}
                    allowClear
                    options={
                        Object.entries(STATUS_LABEL_MAP).map(([value, label]) => ({
                            value,
                            label
                        }))
                    }
                />

                <Button icon={<ClearOutlined />} onClick={handleClear}>Xóa bộ lọc</Button>
                <Button icon={<SearchOutlined />} type='primary' onClick={handleFilter}>Lọc</Button>
            </Space>)}
            <Table<IRequestModule>
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
                columns={columns} dataSource={requests} rowKey={"_id"} />
            <RequestModal
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={SetIsModalOpen}
            />

            <StatusRequestModal
                onRefresh={refreshSelectedRequest}
                access_token={access_token}
                isModalOpen={statusOpen}
                setIsModalOpen={setStatusOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
            <Drawer
                styles={{
                    header: {
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row', // chuyển thành cột trên mobile
                        alignItems: isMobile ? 'flex-start' : 'center',
                        justifyContent: 'space-between',
                        gap: isMobile ? 12 : 0,
                        // Có thể điều chỉnh thêm padding nếu muốn
                        padding: isMobile ? '16px 16px 8px' : undefined,
                    }
                }}
                title="Xem chi tiết đề nghị"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
                size={'65%'}
                extra={
                    canUpdateRequest(user ?? {} as IUser) && (
                        <Button
                            type='primary'
                            onClick={() => showStatusModal()}
                        >
                            Chuyển trạng thái
                        </Button>
                    )
                }
            >
                <RequestDetail
                    user={user}
                    onRefresh={refreshSelectedRequest}
                    access_token={access_token}
                    request={selectedRequest} />
            </Drawer>
        </Context.Provider>
    )
}

export default TableRequests;