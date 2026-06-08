'use client'
import { Modal, message, notification, Upload, UploadProps, Table, Typography, Space } from 'antd';
import React, { useMemo, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import * as Excel from 'exceljs';
import { handleCreateManyTBTren500tr } from '@/app/(main)/quan-tri/csvc/thiet-bi-tren-500-trieu/actions';

interface IProps {
    access_token?: string;
    isModalImportOpen: boolean;
    setIsModalImportOpen: (value: boolean) => void;
}

const { Dragger } = Upload;

const Context = React.createContext({ name: 'Default' });

const ModalImportTBTren500tr = (props: IProps) => {
    const { access_token, isModalImportOpen, setIsModalImportOpen } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [dataImport, setDataImport] = useState<any[]>([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        beforeUpload: (file) => {
            const typeCheck = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
            const isValidate = typeCheck.some((element) => element === file.type);
            if (!isValidate) {
                message.error(`${file.name} không phải file xlsx hoặc csv`);
            }
            return isValidate || Upload.LIST_IGNORE;
        },
        customRequest: ({ onSuccess }) => {
            if (onSuccess) onSuccess('ok');
        },
        async onChange(info) {
            const { status } = info.file;
            if (status === 'done' || info.fileList.length > 0) {
                try {
                    const arrayBuffer = await info.file.originFileObj!.arrayBuffer();
                    const workbook = new Excel.Workbook();
                    await workbook.xlsx.load(arrayBuffer);

                    const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];
                    if (!worksheet) {
                        console.error('Không tìm thấy worksheet');
                        return;
                    }

                    const jsonData: any[] = [];

                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber <= 1) return;

                        const getVal = (colIndex: number) => {
                            const cell = row.getCell(colIndex);
                            return cell.value;
                        };

                        const obj = {
                            name: getVal(1) ? String(getVal(1)) : '',
                            code: getVal(2) ? String(getVal(2)) : '',
                            description: getVal(3) ? String(getVal(3)) : '',
                            unit: getVal(4) ? String(getVal(4)) : '',
                            yearUse: getVal(5) ? Number(getVal(5)) : 0,
                            quantity: getVal(6) ? Number(getVal(6)) : 0,
                            originalPrice: getVal(7) ? Number(getVal(7)) : 0,
                            note: getVal(8) ? String(getVal(8)) : '',
                        };

                        jsonData.push(obj);
                    });

                    setDataImport(jsonData);

                    if (status === 'done') {
                        message.success(`${info.file.name} tải lên thành công`);
                    }
                } catch (error) {
                    console.error('Lỗi đọc file:', error);
                    message.error('Có lỗi khi đọc file Excel');
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} tải lên thất bại`);
            }
        },
        onDrop() { },
    };

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(async () => {
            const response = await handleCreateManyTBTren500tr(dataImport, access_token ?? '');
            if (response.data) {
                messageApi.success(response.message);
                handleCancel();
            } else {
                api.error({
                    title: 'Có lỗi xảy ra',
                    description: response.message,
                    placement: 'topRight',
                });
            }
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        setDataImport([]);
        setIsModalImportOpen(false);
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title="Import dữ liệu thiết bị trên 500 triệu"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalImportOpen}
                onOk={handleOk}
                okText="Import"
                cancelText="Hủy"
                onCancel={handleCancel}
                okButtonProps={{ disabled: dataImport.length === 0 }}
                confirmLoading={confirmLoading}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                }}
            >
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Chọn hoặc kéo thả file để tải dữ liệu</p>
                    <p className="ant-upload-hint">
                        Chỉ hỗ trợ file excel và csv <a onClick={(e) => e.stopPropagation()} href={`${process.env.NEXT_PUBLIC_FRONTEND_URI}sample/sample-tbtren500tr.xlsx`} download>Tải file mẫu</a>
                    </p>
                </Dragger>
                <div>
                    <Table<ITBTren500tr>
                        scroll={{ x: 'max-content' }}
                        title={() => <span>Dữ liệu:</span>}
                        dataSource={dataImport}
                        rowKey={() => crypto.randomUUID()}
                        columns={[
                            {
                                dataIndex: 'name', title: 'Tên tài sản',
                                render: (value) => <Space style={{ maxWidth: 200, display: 'inline-block' }}>
                                    <Typography.Text ellipsis>{value}</Typography.Text>
                                </Space>
                            },
                            { dataIndex: 'code', title: 'Mã tài sản' },
                            {
                                dataIndex: 'description', title: 'Mô tả',
                                render: (value) => <Space style={{ maxWidth: 200, display: 'inline-block' }}>
                                    <Typography.Text ellipsis>{value}</Typography.Text>
                                </Space>
                            },
                            { dataIndex: 'unit', title: 'Đơn vị' },
                            { dataIndex: 'yearUse', title: 'Năm sử dụng' },
                            { dataIndex: 'quantity', title: 'Số lượng' },
                            { dataIndex: 'originalPrice', title: 'Nguyên giá' },
                            { dataIndex: 'note', title: 'Ghi chú' },
                        ]}
                    />
                </div>
            </Modal>
        </Context.Provider>
    );
};

export default ModalImportTBTren500tr;
