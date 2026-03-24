'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Flex, Grid, Input, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, DeleteOutlined, EyeOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { CSVLink } from 'react-csv';
import ModalKiemKe from '@/components/kiem-ke/modal.kiemke';
import { statusArr, typeArr } from '@/components/thiet-bi/table';
import { canCreateSnapshot, canDeleteSnapshot, canReadSnapshot } from '@/libs/snapshot';
import KiemKeDetail from '@/components/kiem-ke/kiemke.detail';
import ModalDeleteSnapshot from '@/components/kiem-ke/modal.delete.snapshot';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
const { useBreakpoint } = Grid;

interface IProps {
    yearsArr: IGetYearSnapshot | any,
    access_token: string,
    user: IUser | null,
    snapshots: ISnapshot[],
    meta: IMeta,
    rooms: IRoom[],
    units: IUnit[],
}

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

const TableSnapshot = (props: IProps) => {
    const { access_token, user, yearsArr, meta, snapshots, rooms, units } = props
    const [isModalDeleteSnapshotOpen, setIsModalDeleteSnapshotOpen] = useState(false)
    const [isModalKiemKeOpen, setIsModalKiemKeOpen] = useState(false)
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
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

    const [dataExport, setDataExport] = useState<any[]>([])
    const screens = useBreakpoint();
    const isMobile = !screens.md;  // < 768px

    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);

    const [selectedDevice, setSelectedDevice] = useState<ISnapshot | null>(null)

    const [open, setOpen] = useState(false);

    const [treeData, setTreeData] = useState<ISnapshot[]>([])
    useEffect(() => {
        const standalone: ISnapshot[] = [];
        const groupMap: Record<string, ISnapshot[]> = {};

        snapshots.forEach(item => {
            if (item.parent) {
                if (!groupMap[item.parent]) groupMap[item.parent] = [];
                groupMap[item.parent].push(item);
            } else {
                standalone.push(item);
            }
        });

        const result: ISnapshot[] = [];

        Object.entries(groupMap).forEach(([parentName, childrenList]) => {
            result.push({
                _id: `group-${parentName}`,
                name: parentName,
                "description": "",
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
                "room": "",
                "unit": "",
                children: childrenList,
                deletedAt: null,
                deletedBy: '',
                isDeleted: false
            });
        });

        result.push(...standalone);

        setTreeData(result);
    }, [snapshots]);

    useEffect(() => {
        const filteredData = snapshots.map(({ _id, name, description, room, usedYear, soKeToan, kiemKe, chenhLech, chatLuongConLai, note, type }) =>
        ({
            _id, name, description,
            room,
            usedYear,
            skt_sl: soKeToan?.soLuong || 0, skt_ng: soKeToan?.nguyenGia || 0, skt_gtcl: soKeToan?.giaTriConLai || 0,
            kt_sl: kiemKe?.soLuong || 0, kt_ng: kiemKe?.nguyenGia || 0, kt_gtcl: kiemKe?.giaTriConLai || 0,
            cl_thua: chenhLech?.thua || 0, cl_thieu: chenhLech?.thieu || 0, cl_gtcl: chenhLech?.giaTriConLai || 0,
            chatLuongConLai, note, type
        }));
        setDataExport(filteredData);
    }, [snapshots])


    const showDrawer = (data: ISnapshot) => {
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
    // Hàm xử lý khi chọn year
    const onChangeYear = (value: number) => {
        setSelectedYear(value);
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
        setSelectedYear(undefined);
        setSelectedName(undefined)
    };

    const showModal = () => {
        setIsModalKiemKeOpen(true);
    }
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // console.log(e);
    };

    const columns: TableProps<ISnapshot>['columns'] = [
        {
            title: 'Tên thiết bị',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => <Space>
                <Typography.Text copyable={{ text: record._id, tooltips: 'Sao chép' }}>
                    {record.name}
                </Typography.Text>

                {!record._id.includes('group') && <><Tooltip title="Xem chi tiết">
                    <EyeOutlined
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={() => showDrawer(record)}
                    />
                </Tooltip>
                </>}
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
            title: 'Nơi sử dụng',
            key: 'room',
            dataIndex: 'room', // Bỏ cái mảng đi

        },
        {
            title: 'Thuộc đơn vị',
            dataIndex: 'unit',
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
        if (selectedRoom) params.set('room', selectedRoom)
        if (selectedUnit) params.set('unit', selectedUnit)
        if (selectedType) params.set('type', selectedType)
        if (selectedStatus) params.set('status', selectedStatus)
        if (selectedYear) params.set('year', selectedYear.toString())

        params.set('current', current.toString())
        params.set('pageSize', pageSize.toString())

        router.push(`/quan-tri/kiem-ke?${params.toString()}`)
    };

    const handleFilter = () => {

        const params = new URLSearchParams()

        if (selectedRoom) params.set('room', selectedRoom)
        if (selectedUnit) params.set('unit', selectedUnit)
        if (selectedType) params.set('type', selectedType)
        if (selectedName) params.set('name', selectedName)
        if (selectedStatus) params.set('status', selectedStatus)
        if (selectedYear) params.set('year', selectedYear.toString())

        router.push(`/quan-tri/kiem-ke?${params.toString()}`)
    }

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection: TableRowSelection<ISnapshot> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const start = () => {
        setIsModalDeleteSnapshotOpen(true)
    };

    const headers = [
        { label: "Mã thiết bị", key: "_id" },
        { label: "Tên thiết bị", key: "name" },
        { label: "Mã số/Mô tả", key: "description" },
        { label: "Nơi sử dụng", key: "room" },
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

                    {canDeleteSnapshot(user ?? {} as IUser) && snapshots.length > 0 && <Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start}>Xóa sổ kiểm kê</Button>}

                    {canReadSnapshot(user ?? {} as IUser) && snapshots.length > 0 && <Button type='primary' icon={<CloudDownloadOutlined />}>
                        <CSVLink
                            data={dataExport}
                            filename={"kiem-ke.csv"}
                            headers={headers}
                            separator={";"}
                        >
                            Export
                        </CSVLink>
                    </Button>}
                    {canCreateSnapshot(user ?? {} as IUser) && <Button onClick={showModal} type='primary' icon={<FolderAddOutlined />}>Chốt sổ kiểm kê</Button>}
                </div>

            </Flex>
            {canReadSnapshot(user ?? {} as IUser) && (<Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                <Select
                    style={{}}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="Vui lòng chọn năm kiểm kê"
                    value={selectedYear}
                    onChange={onChangeYear}
                    allowClear
                    options={yearsArr.years}
                />
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
                            ? rooms.map(({ name }) => ({
                                value: name,
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
                            ? units.map(({ name }) => ({
                                value: name,
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
            <Table<ISnapshot>
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
            <ModalKiemKe
                access_token={access_token}
                isModalKiemKeOpen={isModalKiemKeOpen}
                setIsModalKiemKeOpen={setIsModalKiemKeOpen}
            />
            <Drawer
                title="Xem chi tiết thiết bị"
                extra={`Năm chốt sổ: ${selectedDevice?.year}`}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
                size={'65%'}
            >
                <KiemKeDetail device={selectedDevice} />
            </Drawer>
            <ModalDeleteSnapshot
                isModalDeleteSnapshotOpen={isModalDeleteSnapshotOpen}
                setIsModalDeleteSnapshotOpen={setIsModalDeleteSnapshotOpen}
                access_token={access_token}
                yearsArr={yearsArr}
            />
        </Context.Provider>
    )
}

export default TableSnapshot;