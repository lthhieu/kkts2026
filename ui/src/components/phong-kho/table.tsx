'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Grid, Popconfirm, Space, Table, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined } from '@ant-design/icons';
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
    user: IUser | null
}

const Context = React.createContext({ name: 'Default' });

const TableRooms = (props: IProps) => {
    const { rooms, access_token, meta, units, user } = props
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
            render: (_, record) => <Typography.Text copyable={{ text: record._id }}>{record.name}</Typography.Text>
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
            render: (_, record) => <Typography.Text copyable={{ text: record.currentUnit?._id || "" }}>{record.currentUnit?.name}</Typography.Text>
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {canUpdateRoom(user ?? {} as IUser) &&
                        <Button color="green" variant="outlined" icon={<EditOutlined />}
                            onClick={() => {
                                setDataUpdate(record)
                                setStatus("UPDATE")
                                SetIsModalOpen(true)
                            }}
                        ></Button>}

                    {canDeleteRoom(user ?? {} as IUser) &&
                        <Popconfirm
                            title="Xóa phòng - kho này?"
                            description={`Bạn thực sự muốn xóa phòng - kho ${record.name}`}
                            onConfirm={() => confirm(record._id)}
                            onCancel={cancel}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <Button icon={<DeleteOutlined />} color="danger" variant="outlined"></Button>
                        </Popconfirm>}
                </Space>
            ),
        },
    ];
    const handleOnChangePage = (current: number, pageSize: number) => {
        router.push(`/quan-tri/phong-kho?current=${current}&pageSize=${pageSize}`);
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
    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify='space-between'
                align={isMobile ? 'stretch' : 'center'}
                vertical={isMobile} gap={16}>
                <h2>Danh sách phòng - kho</h2>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canDeleteRoom(user ?? {} as IUser) && <Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>Xóa</Button>}
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
            <Table<IRoom>
                scroll={{ x: "max-content" }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kết quả`,
                    onChange: (page: number, pageSize: number) => handleOnChangePage(page, pageSize),
                    pageSizeOptions: [50, 100, 200],
                    defaultPageSize: 50,
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