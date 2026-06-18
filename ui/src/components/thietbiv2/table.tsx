'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Flex, Grid, Input, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, DeploymentUnitOutlined, DiffOutlined, EditOutlined, EyeOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { canCreateDevice, canDeleteDevice, canManageDevice, canReadDevice, canUpdateDevice } from '@/libs/devices';
import { canCreateRequest } from '@/libs/request';
import RequestModal from '@/components/de-nghi/modal';
import { handleDeleteThietbiV2, handleDeleteThietbiV2Many, handleExportThietbiV2 } from '@/app/(main)/quan-tri/thiet-biv2/actions';
import DeviceDetail from '@/components/thietbiv2/device.detail';
import DeviceV2Modal from '@/components/thietbiv2/modal';
import ModalImportv2 from '@/components/thietbiv2/modal.import';
import ModalExport from '@/components/thietbiv2/modal.export';
import ModalUpdateMany from '@/components/thietbiv2/modal.update.clcl';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
const { useBreakpoint } = Grid;

interface IProps {
    devices: IDeviceV2[],
    access_token: string,
    email: string,
    meta: IMeta,
    rooms: IRoom[],
    units: IUnit[],
    user: IUser | null,
    availableChildren: { _id: string, name: string }[] | null;
}
export const typeArr = [
    { value: 'Công cụ dụng cụ', label: 'Công cụ, dụng cụ' },
    { value: 'Tài sản cố định', label: 'Tài sản cố định' },
    { value: 'Dự án Skeig', label: 'Dự án Skieg' }
]
export const statusArr = [
    { value: 'dangsudung', label: 'Đang sử dụng' },
    { value: 'huhong', label: 'Hư hỏng' },
    { value: 'thanhly', label: 'Thanh lý' },
]
export const STATUS_COLOR_MAP: Record<string, string> = {
    dangsudung: 'green',
    thanhly: 'red',
    huhong: 'blue',
};
export const STATUS_LABEL_MAP: Record<string, string> = {
    dangsudung: 'Đang sử dụng',
    thanhly: 'Thanh lý',
    huhong: 'Hư hỏng'
};

const Context = React.createContext({ name: 'Default' });

const TableDevicesV2 = (props: IProps) => {
    const { devices, access_token, meta, rooms, units, user, email, availableChildren } = props
    const [isModalOpen, SetIsModalOpen] = useState(false)
    const [isModalRequestOpen, setIsModalRequestOpen] = useState(false)

    const [isModalUpdateManyOpen, setIsModalUpdateManyOpen] = useState(false)
    const [isModalImportOpen, SetIsModalImportOpen] = useState(false)
    const [isModalExportOpen, SetIsModalExportOpen] = useState(false)
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | IDeviceV2>(null)
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    //state filter
    const [selectedRoom, setSelectedRoom] = useState<string | undefined>(undefined);
    const [selectedUnit, setSelectedUnit] = useState<string | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

    const [dataExport, setDataExport] = useState<any[]>([])
    const screens = useBreakpoint();
    const isMobile = !screens.md;  // < 768px

    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);

    const [selectedDevice, setSelectedDevice] = useState<IDeviceV2 | null>(null)

    const [open, setOpen] = useState(false);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const showDrawer = (data: IDeviceV2) => {
        setSelectedDevice(data)
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    // Hàm xử lý khi chọn room
    const onChangeRoom = (value: string) => {
        setSelectedRoom(value);
    };
    // Hàm xử lý khi chọn status
    const onChangeStatus = (value: string) => {
        setSelectedStatus(value);
    };
    // Hàm xử lý khi chọn type
    const onChangeType = (value: string) => {
        setSelectedType(value);
    };
    // Hàm xử lý khi chọn unit
    const onChangeUnit = (value: string) => {
        setSelectedUnit(value);
    };

    // Hàm xóa bộ lọc
    const handleClear = () => {
        setSelectedRoom(undefined); // Reset về trạng thái ban đầu
        setSelectedType(undefined);
        setSelectedUnit(undefined);
        setSelectedStatus(undefined)
    };

    const showModal = () => {
        setStatus("CREATE")
        SetIsModalOpen(true);
    }
    const showModalUpdateMany = () => {
        setIsModalUpdateManyOpen(true);
    }
    const showModalImport = () => {
        SetIsModalImportOpen(true);
    }
    const showModalExport = () => {
        SetIsModalExportOpen(true);
    }
    const confirm = (_id: string) => {
        deleteDevice(_id)
    };
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // console.log(e);
    };

    const deleteDevice = async (_id: string) => {
        const res = await handleDeleteThietbiV2(_id, access_token)
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

    const columns: TableProps<IDeviceV2>['columns'] = [
        {
            title: 'Tên thiết bị',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => <Space style={{ maxWidth: 250 }}>
                <Typography.Text ellipsis={{ tooltip: record.name }} copyable={{ text: record._id, tooltips: 'Sao chép' }}>
                    {record.name}
                </Typography.Text>

                <Tooltip title="Xem chi tiết">
                    <EyeOutlined style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => showDrawer(record)} />
                </Tooltip>
                {canUpdateDevice(user ?? {} as IUser) && (
                    <Tooltip title="Cập nhật">
                        <EditOutlined
                            style={{ color: '#1cc03d', cursor: 'pointer' }}
                            onClick={() => {
                                setDataUpdate(record)
                                setStatus("UPDATE")
                                SetIsModalOpen(true)
                            }}
                        />
                    </Tooltip>
                )}
                {canDeleteDevice(user ?? {} as IUser) && (
                    <Popconfirm
                        title="Xóa thiết bị này?"
                        description={`Bạn thực sự muốn xóa thiết bị ${record.name}`}
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
                {canCreateRequest(user ?? {} as IUser) && (
                    <Tooltip title="Đề nghị">
                        <DiffOutlined
                            style={{ color: '#e426cb', cursor: 'pointer' }}
                            onClick={() => {
                                setDataUpdate(record)
                                setIsModalRequestOpen(true)
                            }}
                        />
                    </Tooltip>
                )}
            </Space>
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
            title: 'Số lượng',
            dataIndex: ['kiemKe', 'soLuong'],
            key: 'soLuong',
        },
        {
            title: 'Giảng viên quản lý',
            dataIndex: 'currentRoom',
            key: 'currentRoomUsers',
            render: (currentRoom: IRoom[] | null | undefined) => {
                if (!currentRoom || currentRoom.length === 0) {
                    return <span style={{ color: '#999' }}>—</span>;
                }

                // 1. Gom tất cả name từ users của mọi phòng
                // 2. Lọc giá trị rỗng & dùng Set để bỏ trùng (nếu 1 người phụ trách nhiều phòng)
                const names = [
                    ...new Set(
                        currentRoom.flatMap(room =>
                            room.users?.map((u: any) => u.name).filter(Boolean) || []
                        )
                    )
                ];

                if (names.length === 0) return <span style={{ color: '#999' }}>—</span>;

                // Hiển thị dạng chuỗi ngăn cách bởi dấu phẩy
                return (
                    <Space style={{ maxWidth: 150 }}>
                        <Typography.Text ellipsis >
                            {names.join(', ')}
                        </Typography.Text>
                    </Space>
                )
            }
        },
        {
            title: 'Nơi sử dụng',
            key: 'currentRoom',
            dataIndex: 'currentRoom', // Bỏ cái mảng đi
            render: (currentRooms) => {
                // Kiểm tra nếu currentRooms là mảng và có phần tử
                if (Array.isArray(currentRooms) && currentRooms.length > 0) {
                    // Lấy ra danh sách tên và nối chúng lại
                    return (
                        <Space style={{ maxWidth: 150 }}>
                            <Typography.Text ellipsis>
                                {currentRooms.map(room => room?.name).filter(Boolean).join(', ')}
                            </Typography.Text>
                        </Space>
                    )

                }
                return ""; // Trả về chuỗi rỗng nếu không có dữ liệu
            },
        },
        {
            title: 'Thuộc đơn vị',
            dataIndex: ['unit', 'name'],
            key: 'unit',
            render: (_, record) => <Space style={{ maxWidth: 150 }}>
                <Typography.Text ellipsis copyable={{ text: record.unit._id, tooltips: 'Sao chép' }}>
                    {record.unit.name}
                </Typography.Text>
            </Space>
        },
        {
            title: 'Năm sử dụng',
            dataIndex: 'usedYear',
            key: 'usedYear',
        },
        {
            title: 'Chất lượng còn lại',
            dataIndex: 'chatLuongConLai',
            key: 'chatLuongConLai',
            render: (_, record) => {
                if (record.chatLuongConLai === null) return
                return `${record.chatLuongConLai}%`
            }
        },
    ];
    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams()
        if (selectedName) params.set('name', selectedName)
        if (selectedRoom) params.set('currentRoom', selectedRoom)
        if (selectedUnit) params.set('unit', selectedUnit)
        if (selectedType) params.set('type', selectedType)
        if (selectedStatus) params.set('status', selectedStatus)

        params.set('current', current.toString())
        params.set('pageSize', pageSize.toString())

        router.push(`/quan-tri/thiet-biv2?${params.toString()}`)
    };

    const handleFilter = () => {
        const params = new URLSearchParams()

        if (selectedRoom) params.set('currentRoom', selectedRoom)
        if (selectedUnit) params.set('unit', selectedUnit)
        if (selectedType) params.set('type', selectedType)
        if (selectedName) params.set('name', selectedName)
        if (selectedStatus) params.set('status', selectedStatus)

        params.set('current', '1')
        params.set('pageSize', meta.pageSize.toString())

        router.push(`/quan-tri/thiet-biv2?${params.toString()}`)
    }

    const deleteDeviceMany = async (ids: string[]) => {
        //xóa id có từ group
        const ids_filter = ids.filter(item => !item.includes("group"));
        const res = await handleDeleteThietbiV2Many(ids_filter, access_token)
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

    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            deleteDeviceMany(selectedRowKeys as string[])
            setSelectedRowKeys([])
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection: TableRowSelection<IDeviceV2> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex wrap style={{ marginBottom: 16, gap: 8 }} justify='space-between' align='center'>
                <h2>Danh sách thiết bị</h2>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canManageDevice(user ?? {} as IUser) &&
                        <Button icon={<DeploymentUnitOutlined />} type='primary' onClick={showModalUpdateMany}>
                            Cập nhật chất lượng thiết bị
                        </Button>}
                    {canDeleteDevice(user ?? {} as IUser) && <Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>Xóa {selectedRowKeys.length !== 0 && `(${selectedRowKeys.length})`}</Button>}
                    {canCreateDevice(user ?? {} as IUser) && <Button onClick={showModalImport} type='primary' icon={<CloudUploadOutlined />}>Import</Button>}
                    {canReadDevice(user ?? {} as IUser) && mounted && (<Button onClick={showModalExport} type='primary' icon={<CloudDownloadOutlined />}>
                        Export
                    </Button>)}
                    {canCreateDevice(user ?? {} as IUser) && <Button onClick={showModal} type='primary' icon={<FolderAddOutlined />}>Thêm mới</Button>}
                </div>

            </Flex>
            {canReadDevice(user ?? {} as IUser) && (<Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                <Input allowClear placeholder="Tìm theo tên thiết bị"
                    onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />
                <Select
                    style={{ width: '100%' }}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn phòng - kho"
                    // 🔥 Gán value từ state vào đây
                    value={selectedRoom}
                    onChange={onChangeRoom}
                    allowClear
                    options={
                        rooms && rooms.length > 0
                            ? rooms.map(({ _id, name }) => ({
                                value: _id,
                                label: name
                            }))
                            : []
                    }
                />
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
                    placeholder="Vui lòng chọn loại thiết bị"
                    value={selectedType}
                    onChange={onChangeType}
                    allowClear
                    options={typeArr}
                />
                <Select
                    style={{ width: '100%' }}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn trạng thái thiết bị"
                    value={selectedStatus}
                    onChange={onChangeStatus}
                    allowClear
                    options={statusArr}
                />
                <Button icon={<ClearOutlined />} onClick={handleClear}>Xóa bộ lọc</Button>
                <Button icon={<SearchOutlined />} type='primary' onClick={handleFilter}>Lọc</Button>
            </Space>)}
            <Table<IDeviceV2>
                scroll={{ x: "max-content" }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kết quả`,
                    onChange: (page: number, pageSize: number) => handleOnChangePage(page, pageSize),
                    pageSizeOptions: [20, 50, 100, 200],
                    defaultPageSize: 20,
                    showSizeChanger: true,
                }}
                rowSelection={{ ...rowSelection, checkStrictly: false }}
                columns={columns} dataSource={devices} rowKey={"_id"} />
            <DeviceV2Modal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                email={email}
                isModalOpen={isModalOpen}
                setIsModalOpen={SetIsModalOpen}
                //update info
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                rooms={rooms}
                units={units}
                availableChildren={availableChildren}
            />
            <ModalImportv2
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={SetIsModalImportOpen}
            />
            <ModalExport
                access_token={access_token}
                isModalExportOpen={isModalExportOpen}
                setIsModalExportOpen={SetIsModalExportOpen}
                units={units}
            />
            <ModalUpdateMany
                access_token={access_token}
                isModalUpdateManyOpen={isModalUpdateManyOpen}
                setIsModalUpdateManyOpen={setIsModalUpdateManyOpen}
            />
            <RequestModal
                access_token={access_token}
                isModalOpen={isModalRequestOpen}
                setIsModalOpen={setIsModalRequestOpen}
                //update info
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
            <Drawer
                title="Xem chi tiết thiết bị"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
                size={'large'}
                extra={
                    canUpdateDevice(user ?? {} as IUser) && selectedDevice?.status !== 'daxoa' && (
                        <Button type="primary" icon={<EditOutlined />}
                            onClick={() => { onClose(); setDataUpdate(selectedDevice); setStatus('UPDATE'); SetIsModalOpen(true); }}>
                            Chỉnh sửa
                        </Button>
                    )
                }
            >
                <DeviceDetail device={selectedDevice} />
            </Drawer>
        </Context.Provider>
    )
}

export default TableDevicesV2;