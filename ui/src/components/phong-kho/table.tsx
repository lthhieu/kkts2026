'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Grid, Input, Popconfirm, Select, Space, Table, Tooltip, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeleteRoom, handleDeleteRoomMany } from '@/app/(main)/quan-tri/phong-kho/actions';
import RoomModal from '@/components/phong-kho/modal';
import { canCreateRoom, canDeleteRoom, canReadRoom, canUpdateRoom } from '@/libs/rooms';
import ModalImport from '@/components/phong-kho/modal.import';
import { CSVLink } from 'react-csv';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
const { useBreakpoint } = Grid;

interface IProps {
    rooms: IRoom[],
    units: IUnit[],
    access_token: string,
    meta: IMeta,
    user: IUser | null,
    users: IUser[] | null
}

const Context = React.createContext({ name: 'Default' });

const TableRooms = (props: IProps) => {
    const { rooms, access_token, meta, units, user, users } = props
    const [isModalOpen, SetIsModalOpen] = useState(false)
    const [isModalImportOpen, SetIsModalImportOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [status, setStatus] = useState('')
    const [dataUpdate, setDataUpdate] = useState<null | IRoom>(null)
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [dataExport, setDataExport] = useState<any[]>([])
    const screens = useBreakpoint();
    const isMobile = !screens.md;  // < 768px

    const [selectedUnit, setSelectedUnit] = useState<string | undefined>(undefined);
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);


    useEffect(() => {
        const filteredData = rooms.map(({ _id, name, currentDescription, currentUnit, currentYear }) => ({ _id, name, currentDescription, currentUnit: currentUnit.name || "", currentYear }));
        setDataExport(filteredData);
    }, [rooms])

    const showModal = () => {
        setStatus("CREATE")
        SetIsModalOpen(true);
    }
    const showModalImport = () => {
        SetIsModalImportOpen(true);
    }
    const confirm = (_id: string) => {
        deleteRoom(_id)
    };
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // console.log(e);
    };

    const deleteRoom = async (_id: string) => {
        const res = await handleDeleteRoom(_id, access_token)
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
    const deleteRoomMany = async (ids: string[]) => {
        const res = await handleDeleteRoomMany(ids, access_token)
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

    const columns: TableProps<IRoom>['columns'] = [
        {
            title: 'Tên phòng - kho',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => <Space>
                <Typography.Text copyable={{ text: record._id, tooltips: 'Sao chép' }}>{record.name}</Typography.Text>
                {canUpdateRoom(user ?? {} as IUser) && (
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

                {canDeleteRoom(user ?? {} as IUser) && (
                    <Popconfirm
                        title="Xóa phòng - kho này?"
                        description={`Bạn thực sự muốn xóa phòng - kho ${record.name}`}
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
            title: 'Mô tả',
            dataIndex: 'currentDescription',
            key: 'description',
        },
        {
            title: 'Đơn vị',
            dataIndex: ['currentUnit', 'name'],
            key: 'unit',
            render: (_, record) => <Typography.Text copyable={{ text: record.currentUnit?._id || "", tooltips: 'Sao chép' }}>{record.currentUnit?.name}</Typography.Text>
        },
    ];
    const handleOnChangePage = (current: number, pageSize: number) => {
        const params = new URLSearchParams()

        if (selectedName) params.set('name', selectedName)
        if (selectedUnit) params.set('unit', selectedUnit)

        params.set('current', current.toString())
        params.set('pageSize', pageSize.toString())
        router.push(`/quan-tri/phong-kho?${params.toString()}`);
    };

    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            deleteRoomMany(selectedRowKeys as string[])
            setSelectedRowKeys([])
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection: TableRowSelection<IRoom> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const headers = [
        { label: "Mã phòng - kho", key: "_id" },
        { label: "Tên phòng - kho", key: "name" },
        { label: "Mô tả", key: "currentDescription" },
        { label: "Đơn vị", key: "currentUnit" },
        { label: "Năm", key: "currentYear" }
    ];
    // Hàm xử lý khi chọn unit
    const onChangeUnit = (value: string) => {
        setSelectedUnit(value);
    };

    // Hàm xóa bộ lọc
    const handleClear = () => {
        setSelectedUnit(undefined);
        setSelectedName(undefined)
    };
    const handleFilter = () => {
        const params = new URLSearchParams()
        if (selectedUnit) params.set('unit', selectedUnit)
        if (selectedName) params.set('name', selectedName)

        params.set('current', '1')
        params.set('pageSize', meta.pageSize.toString())

        router.push(`/quan-tri/phong-kho?${params.toString()}`)
    }
    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify='space-between'
                align={isMobile ? 'stretch' : 'center'}
                vertical={isMobile} gap={16}>
                <h2>Danh sách phòng - kho</h2>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canDeleteRoom(user ?? {} as IUser) && <Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>Xóa {selectedRowKeys.length !== 0 && `(${selectedRowKeys.length})`}</Button>}
                    {canCreateRoom(user ?? {} as IUser) && <Button onClick={showModalImport} type='primary' icon={<CloudUploadOutlined />}>Import</Button>}
                    {canReadRoom(user ?? {} as IUser) && <Button type='primary' icon={<CloudDownloadOutlined />}>
                        <CSVLink
                            data={dataExport}
                            filename={"phong-kho.csv"}
                            headers={headers}
                            separator={";"}
                        >
                            Export
                        </CSVLink>
                    </Button>}
                    {canCreateRoom(user ?? {} as IUser) && <Button onClick={showModal} type='primary' icon={<FolderAddOutlined />}>Thêm mới</Button>}
                </div>
            </Flex>
            {canReadRoom(user ?? {} as IUser) && (<Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                <Input allowClear placeholder="Tìm theo tên phòng - kho"
                    onChange={(e) => setSelectedName(e.target.value)} value={selectedName} />
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
                <Button icon={<ClearOutlined />} onClick={handleClear}>Xóa bộ lọc</Button>
                <Button icon={<SearchOutlined />} type='primary' onClick={handleFilter}>Lọc</Button>
            </Space>)}
            <Table<IRoom>
                scroll={{ x: "max-content" }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kết quả`,
                    onChange: (page: number, pageSize: number) => handleOnChangePage(page, pageSize),
                    pageSizeOptions: [20, 50, 100],
                    defaultPageSize: 20,
                    showSizeChanger: true,
                }}
                rowSelection={{ type: 'checkbox', ...rowSelection }}
                columns={columns} dataSource={rooms} rowKey={"_id"} />

            <RoomModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={SetIsModalOpen}
                //update info
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                units={units}
                users={users}
            />

            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={SetIsModalImportOpen}
            />
        </Context.Provider>
    )
}

export default TableRooms;