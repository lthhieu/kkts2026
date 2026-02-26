'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Grid, Input, Popconfirm, Space, Table, Typography, message, notification } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { ClearOutlined, CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { handleDeleteUnit, handleDeleteUnitMany } from '@/app/(main)/quan-tri/don-vi/actions';
import UnitModal from '@/components/don-vi/modal';
import ModalImport from '@/components/don-vi/modal.import';
import { canCreateUnit, canDeleteUnit, canReadUnit, canUpdateUnit } from '@/libs/units';
import { CSVLink } from 'react-csv';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
const { useBreakpoint } = Grid;

interface IProps {
    units: IUnit[],
    access_token: string,
    meta: IMeta,
    user: IUser | null
}

const Context = React.createContext({ name: 'Default' });

const TableUnits = (props: IProps) => {
    const { units, access_token, meta, user } = props
    const [isModalOpen, SetIsModalOpen] = useState(false)
    const [isModalImportOpen, SetIsModalImportOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [status, setStatus] = useState('')
    const [dataUpdate, setDataUpdate] = useState<null | IUnit>(null)
    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [dataExport, setDataExport] = useState<any[]>([])
    const screens = useBreakpoint();
    const isMobile = !screens.md;  // < 768px
    const [selectedName, setSelectedName] = useState<string | undefined>(undefined);


    useEffect(() => {
        const filteredData = units.map(({ _id, name }) => ({ _id, name }));
        setDataExport(filteredData);
    }, [units])

    const showModal = () => {
        setStatus("CREATE")
        SetIsModalOpen(true);
    }
    const showModalImport = () => {
        SetIsModalImportOpen(true);
    }
    const confirm = (_id: string) => {
        deleteUnit(_id)
    };
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // console.log(e);
    };

    const deleteUnit = async (_id: string) => {
        const res = await handleDeleteUnit(_id, access_token)
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

    const deleteUnitMany = async (ids: string[]) => {
        const res = await handleDeleteUnitMany(ids, access_token)
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
            title: 'Tên đơn vị',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => <Typography.Text copyable={{ text: record._id }}>{record.name}</Typography.Text>
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {canUpdateUnit(user ?? {} as IUser) && (
                        <Button color="green" variant="outlined" icon={<EditOutlined />}
                            onClick={() => {
                                setDataUpdate(record)
                                setStatus("UPDATE")
                                SetIsModalOpen(true)
                            }}
                        ></Button>
                    )}

                    {canDeleteUnit(user ?? {} as IUser) && (
                        <Popconfirm
                            title="Xóa đơn vị này?"
                            description={`Bạn thực sự muốn xóa đơn vị ${record.name}`}
                            onConfirm={() => confirm(record._id)}
                            onCancel={cancel}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <Button icon={<DeleteOutlined />} color="danger" variant="outlined"></Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];
    const handleOnChangePage = (current: number, pageSize: number) => {
        router.push(`/quan-tri/don-vi?current=${current}&pageSize=${pageSize}`);
    };
    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            deleteUnitMany(selectedRowKeys as string[])
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
    const headers = [
        { label: "Mã đơn vị", key: "_id" },
        { label: "Tên đơn vị", key: "name" }
    ];

    // Hàm xóa bộ lọc
    const handleClear = () => {
        setSelectedName(undefined)
    };
    const handleFilter = () => {
        const params = new URLSearchParams()
        if (selectedName) params.set('name', selectedName)

        params.set('current', '1')
        params.set('pageSize', meta.pageSize.toString())

        router.push(`/quan-tri/don-vi?${params.toString()}`)
    }
    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Flex style={{ marginBottom: 16 }} justify='space-between'
                align={isMobile ? 'stretch' : 'center'}
                vertical={isMobile} gap={16}>
                <h2>Danh sách đơn vị</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {canDeleteUnit(user ?? {} as IUser) && (<Button icon={<DeleteOutlined />} color="danger" variant="solid" onClick={start} disabled={!hasSelected} loading={loading}>Xóa</Button>)}
                    {canCreateUnit(user ?? {} as IUser) && (<Button onClick={showModalImport} type='primary' icon={<CloudUploadOutlined />}>Import</Button>)}
                    {canReadUnit(user ?? {} as IUser) && (<Button type='primary' icon={<CloudDownloadOutlined />}>
                        <CSVLink
                            data={dataExport}
                            filename={"don-vi.csv"}
                            headers={headers}
                            separator={";"}
                        >
                            Export
                        </CSVLink>
                    </Button>)}
                    {canCreateUnit(user ?? {} as IUser) && (<Button onClick={showModal} type='primary' icon={<FolderAddOutlined />}>Thêm mới</Button>)}
                </div>
            </Flex>
            {canReadUnit(user ?? {} as IUser) && (<Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
                <Input allowClear placeholder="Tìm theo tên đơn vị"
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
                    pageSizeOptions: [5, 10, 20],
                    showSizeChanger: true,
                }}
                rowSelection={{ type: 'checkbox', ...rowSelection }}
                columns={columns} dataSource={units} rowKey={"_id"} />
            <UnitModal
                setStatus={setStatus}
                status={status}
                access_token={access_token}
                isModalOpen={isModalOpen}
                setIsModalOpen={SetIsModalOpen}
                //update info
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
            <ModalImport
                access_token={access_token}
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={SetIsModalImportOpen}
            />
        </Context.Provider>
    )
}

export default TableUnits;