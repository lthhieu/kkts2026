'use client'
import { Modal, message, notification, Upload, UploadProps, Table } from 'antd';
import React, { useMemo, useState } from 'react';
import { handleCreateManyToanha } from '@/app/(main)/quan-tri/csvc/toa-nha/actions';
import { InboxOutlined } from '@ant-design/icons';
import * as Excel from 'exceljs';

interface IProps {
    access_token?: string;
    isModalImportOpen: boolean;
    setIsModalImportOpen: (value: boolean) => void;
}

const { Dragger } = Upload;

const Context = React.createContext({ name: 'Default' });

const ModalImportToanha = (props: IProps) => {
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
                        if (rowNumber <= 2) return;

                        const getVal = (colIndex: number) => {
                            const cell = row.getCell(colIndex);
                            return cell.value;
                        };

                        // A=ma_toanha, B=ten_toanha, C=dtxd, D=tong_dt_sxd, E=so_tang, F=nam_sd, G=diachi
                        const obj = {
                            ma_toanha: getVal(1) ? String(getVal(1)) : '',
                            ten_toanha: getVal(2) ? String(getVal(2)) : '',
                            dtxd: Number(getVal(3)) || 0,
                            tong_dt_sxd: Number(getVal(4)) || 0,
                            so_tang: Number(getVal(5)) || 0,
                            nam_sd: Number(getVal(6)) || 0,
                            htsh: getVal(7) ? String(getVal(7)) : null,
                            diachi: getVal(8) ? String(getVal(8)) : null,
                            tinh_trang_sd: getVal(9) ? String(getVal(9)) : null,
                            ngay_chuyen_tt: getVal(10) ? String(getVal(10)) : null,

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
            const response = await handleCreateManyToanha(dataImport, access_token ?? '');
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
                title="Import dữ liệu tòa nhà"
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
                        Chỉ hỗ trợ file excel và csv
                        &nbsp;<a onClick={(e) => e.stopPropagation()} href={`${process.env.NEXT_PUBLIC_FRONTEND_URI}sample/sample-toanha.xlsx`} download>Tải file mẫu</a>
                    </p>
                </Dragger>
                <div>
                    <Table<any>
                        scroll={{ x: 'max-content' }}
                        title={() => <span>Dữ liệu:</span>}
                        dataSource={dataImport}
                        rowKey={() => crypto.randomUUID()}
                        columns={[
                            { dataIndex: 'ma_toanha', title: 'Mã tòa nhà' },
                            { dataIndex: 'ten_toanha', title: 'Tên tòa nhà' },
                            { dataIndex: 'nam_sd', title: 'Năm sử dụng' },
                        ]}
                    />
                </div>
            </Modal>
        </Context.Provider>
    );
};

export default ModalImportToanha;
