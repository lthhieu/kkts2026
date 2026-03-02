'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Flex, Grid, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeleteDevice, handleDeleteDeviceMany } from '@/app/(main)/quan-tri/thiet-bi/actions';
import DeviceModal from '@/components/thiet-bi/modal';
import { canCreateDevice, canDeleteDevice, canReadDevice, canUpdateDevice } from '@/libs/devices';
import ModalImport from '@/components/thiet-bi/modal.import';
import { CSVLink } from 'react-csv';
import DeviceDetail from '@/components/thiet-bi/device.detail';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
const { useBreakpoint } = Grid;

interface IProps {
    devices: IDevice[],
    access_token: string,
    meta: IMeta,
    rooms: IRoom[],
    units: IUnit[],
    user: IUser | null,
}

const Context = React.createContext({ name: 'Default' });

const TableDevices = (props: IProps) => {
    const { devices, access_token, meta, rooms, units, user } = props
    const [isModalOpen, SetIsModalOpen] = useState(false)
    const [isModalImportOpen, SetIsModalImportOpen] = useState(false)
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataUpdate, setDataUpdate] = useState<null | IDevice>(null)
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    //state filter
    const [selectedRoom, setSelectedRoom] = useState<string | undefined>(undefined);
    const [selectedUnit, setSelectedUnit] = useState<string | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<string | undefined>(undefined);

    const [dataExport, setDataExport] = useState<any[]>([])
    const screens = useBreakpoint();
    const isMobile = !screens.md;  // < 768px

    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);

    const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null)

    const [open, setOpen] = useState(false);

    const [treeData, setTreeData] = useState<IDevice[]>([])
    useEffect(() => {
        const standalone: IDevice[] = [];
        const groupMap: Record<string, IDevice[]> = {};

        devices.forEach(item => {
            if (item.parent) {
                if (!groupMap[item.parent]) groupMap[item.parent] = [];
                groupMap[item.parent].push(item);
            } else {
                standalone.push(item);
            }
        });

        const result: IDevice[] = [];

        Object.entries(groupMap).forEach(([parentName, childrenList]) => {
            result.push({
                _id: `group-${parentName}`,
                name: parentName,
                "description": "",
                "usedLocation": [],
                "usedYear": null,
                "soKeToan": {
                    "soLuong": null,
                    "nguyenGia": 0,
                    "giaTriConLai": null
                },
                "kiemKe": {
                    "soLuong": null,
                    "nguyenGia": 0,
                    "giaTriConLai": null
                },
                "chenhLech": {
                    "thua": 0,
                    "thieu": 0,
                    "giaTriConLai": 0
                },
                "chatLuongConLai": null,
                "note": "",
                "trongSoChatLuong": 0,
                "type": "",
                "currentRoom": {
                    "_id": "",
                    "name": ""
                },
                "unit": {
                    "_id": "",
                    "name": ""
                },

                children: childrenList,
            });
        });

        result.push(...standalone);

        setTreeData(result);
    }, [devices]);


    const showDrawer = (data: IDevice) => {
        setSelectedDevice(data)
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        const filteredData = devices.map(({ _id, name, description, currentRoom, usedYear, soKeToan, kiemKe, chenhLech, chatLuongConLai, note, type }) =>
        ({
            _id, name, description, currentRoom: currentRoom?.name || "", usedYear,
            skt_sl: soKeToan?.soLuong || 0, skt_ng: soKeToan?.nguyenGia || 0, skt_gtcl: soKeToan?.giaTriConLai || 0,
            kt_sl: kiemKe?.soLuong || 0, kt_ng: kiemKe?.nguyenGia || 0, kt_gtcl: kiemKe?.giaTriConLai || 0,
            cl_thua: chenhLech?.thua || 0, cl_thieu: chenhLech?.thieu || 0, cl_gtcl: chenhLech?.giaTriConLai || 0,
            chatLuongConLai, note, type
        }));
        setDataExport(filteredData);
    }, [devices])

    // Hàm xử lý khi chọn room
    const onChangeRoom = (value: string) => {
        setSelectedRoom(value);
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
    };

    const showModal = () => {
        setStatus("CREATE")
        SetIsModalOpen(true);
    }
    const showModalImport = () => {
        SetIsModalImportOpen(true);
    }
    const confirm = (_id: string) => {
        deleteDevice(_id)
    };
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // console.log(e);
    };

    const deleteDevice = async (_id: string) => {
        const res = await handleDeleteDevice(_id, access_token)
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

    const columns: TableProps<IDevice>['columns'] = [
        {
            title: 'Tên thiết bị',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render: (_, record) => <Space>
                <Typography.Text>
                    {record.name}
                </Typography.Text>

                {!record._id.includes('group') && <><Tooltip title="Xem chi tiết">
                    <EyeOutlined
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={() => showDrawer(record)}
                    />
                </Tooltip>
                    {canUpdateDevice(user ?? {} as IUser, record?.unit?._id! || 'unit_id') && (
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


                    )}</>}
            </Space>
        },
        {
            title: 'Số lượng',
            dataIndex: ['kiemKe', 'soLuong'],
            key: 'soLuong',
        },
        {
            title: 'Nơi sử dụng',
            dataIndex: ['currentRoom', 'name'],
            key: 'currentRoom',
        },
        {
            title: 'Thuộc đơn vị',
            dataIndex: ['unit', 'name'],
            key: 'unit',
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

        params.set('current', current.toString())
        params.set('pageSize', pageSize.toString())

        router.push(`/quan-tri/thiet-bi?${params.toString()}`)
    };

    const handleFilter = () => {
        const params = new URLSearchParams()

        if (selectedRoom) params.set('currentRoom', selectedRoom)
        if (selectedUnit) params.set('unit', selectedUnit)
        if (selectedType) params.set('type', selectedType)
        if (selectedName) params.set('name', selectedName)

        params.set('current', '1')
        params.set('pageSize', meta.pageSize.toString())

        router.push(`/quan-tri/thiet-bi?${params.toString()}`)
    }

    const deleteDeviceMany = async (ids: string[]) => {
        //xóa id có từ group
        const ids_filter = ids.filter(item => !item.includes("group"));
        const res = await handleDeleteDeviceMany(ids_filter, access_token)
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
    const rowSelection: TableRowSelection<IDevice> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const headers = [
        { label: "Mã thiết bị", key: "_id" },
        { label: "Tên thiết bị", key: "name" },
        { label: "Mã số/Mô tả", key: "description" },
        { label: "Nơi sử dụng", key: "currentRoom" },
        { label: "Năm sử dụng", key: "usedYear" },
        { label: "Sổ KT - Số lượng", key: "skt_sl" },
        { label: "Sổ KT - Nguyên giá", key: "skt_ng" },
        { label: "Sổ KT - Giá trị còn lại", key: "skt_gtcl" },
        { label: "Kiểm kê - Số lượng", key: "kt_sl" },
        { label: "Kiểm kê - Nguyên giá", key: "kt_ng" },
        { label: "Kiểm kê - Giá trị còn lại", key: "kt_gtcl" },
        { label: "Chênh lệch - Thừa", key: "cl_thua" },
        { label: "Chênh lệch - Thiếu", key: "cl_thieu" },
        { label: "Chênh lệch - Giá trị còn lại", key: "cl_gtcl" },
        { label: "Chất lượng còn lại", key: "chatLuongConLai" },
        { label: "Ghi chú", key: "note" },
        { label: "Loại thiết bị", key: "type" },
    ];

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify='space-between'
                align={isMobile ? 'stretch' : 'center'}
                vertical={isMobile} gap={16}>
                <h2>Danh sách thiết bị</h2>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canDeleteDevice(user ?? {} as IUser) && <Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>Xóa</Button>}
                    {canCreateDevice(user ?? {} as IUser) && <Button onClick={showModalImport} type='primary' icon={<CloudUploadOutlined />}>Import</Button>}
                    {canReadDevice(user ?? {} as IUser) && <Button type='primary' icon={<CloudDownloadOutlined />}>
                        <CSVLink
                            data={dataExport}
                            filename={"thiet-bi.csv"}
                            headers={headers}
                            separator={";"}
                        >
                            Export
                        </CSVLink>
                    </Button>}
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
                <Select
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
                />
                <Select
                    style={{ width: '100%' }}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn loại thiết bị"
                    value={selectedType}
                    onChange={onChangeType}
                    allowClear
                    options={[
                        { value: 'Công cụ dụng cụ', label: 'Công cụ, dụng cụ' },
                        { value: 'Tài sản cố định', label: 'Tài sản cố định' },
                        { value: 'Dự án Skeig', label: 'Dự án Skeig' }
                    ]}
                />
                <Button icon={<ClearOutlined />} onClick={handleClear}>Xóa bộ lọc</Button>
                <Button icon={<SearchOutlined />} type='primary' onClick={handleFilter}>Lọc</Button>
            </Space>)}
            <Table<IDevice>
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
                columns={columns} dataSource={treeData} rowKey={"_id"} />
            <DeviceModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={SetIsModalOpen}
                //update info
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                rooms={rooms}
                units={units}
            />
            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={SetIsModalImportOpen}
            />
            <Drawer
                title="Xem chi tiết thiết bị"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
                size={'65%'}
            >
                <DeviceDetail device={selectedDevice} />
            </Drawer>
        </Context.Provider>
    )
}

export default TableDevices;