'use client'
import { Modal, message, notification, Upload, UploadProps, Table } from 'antd';
import React, { useMemo, useState } from 'react';
import { handleCreateManyDatdai } from '@/app/(main)/quan-tri/csvc/dat-dai/actions';
import { InboxOutlined } from '@ant-design/icons';
import * as Excel from 'exceljs';

interface IProps {
    access_token?: string;
    isModalImportOpen: boolean;
    setIsModalImportOpen: (value: boolean) => void;
}

const { Dragger } = Upload;
const Context = React.createContext({ name: 'Default' });

const ModalImportDatdai = (props: IProps) => {
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
            if (!isValidate) message.error(`${file.name} không phải file xlsx hoặc csv`);
            return isValidate || Upload.LIST_IGNORE;
        },
        customRequest: ({ onSuccess }) => { if (onSuccess) onSuccess('ok'); },
        async onChange(info) {
            const { status } = info.file;
            if (status === 'done' || info.fileList.length > 0) {
                try {
                    const arrayBuffer = await info.file.originFileObj!.arrayBuffer();
                    const workbook = new Excel.Workbook();
                    await workbook.xlsx.load(arrayBuffer);
                    const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];
                    if (!worksheet) return;

                    const jsonData: any[] = [];
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber <= 2) return;
                        const getVal = (col: number) => row.getCell(col).value;
                        // A=ma_giay_cnqsh, B=dt, C=cqsh, D=minh_chung_qshd, E=nam_bd_sdd, F=tg_sdd, G=dtd_da_sd, H=diachi
                        jsonData.push({
                            ma_giay_cnqsh: getVal(1) ? String(getVal(1)) : '',
                            dt: Number(getVal(2)) || 0,
                            htsd: getVal(3) ? String(getVal(3)) : '',
                            cqsh: getVal(4) ? String(getVal(4)) : '',
                            minh_chung_qshd: getVal(5) ? String(getVal(5)) : '',
                            muc_dich_shd: getVal(6) ? String(getVal(6)) : null,
                            nam_bd_sdd: Number(getVal(7)) || 0,
                            tg_sdd: Number(getVal(8)) || 0,
                            dtd_da_sd: Number(getVal(9)) || 0,
                            tinh_trang_sd: getVal(10) ? String(getVal(10)) : null,
                            ngay_chuyen_tt: getVal(11) ? String(getVal(11)) : null,
                            tinhthanhpho: getVal(12) ? String(getVal(12)) : null,
                            xaphuong: getVal(13) ? String(getVal(13)) : null,
                            diachi: getVal(14) ? String(getVal(14)) : '',
                        });
                    });
                    setDataImport(jsonData);
                    if (status === 'done') message.success(`${info.file.name} tải lên thành công`);
                } catch (error) {
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
            const response = await handleCreateManyDatdai(dataImport, access_token ?? '');
            if (response.data) {
                messageApi.success(response.message);
                handleCancel();
            } else {
                api.error({ title: 'Có lỗi xảy ra', description: response.message, placement: 'topRight' });
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
                title="Import dữ liệu đất đai"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalImportOpen}
                onOk={handleOk}
                okText="Import"
                cancelText="Hủy"
                onCancel={handleCancel}
                okButtonProps={{ disabled: dataImport.length === 0 }}
                confirmLoading={confirmLoading}
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%' }}
            >
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Chọn hoặc kéo thả file để tải dữ liệu</p>
                    <p className="ant-upload-hint">
                        Chỉ hỗ trợ file excel và csv
                        &nbsp;<a onClick={(e) => e.stopPropagation()} href={`${process.env.NEXT_PUBLIC_FRONTEND_URI}sample/sample-datdai.xlsx`} download>Tải file mẫu</a>
                    </p>
                </Dragger>
                <div>
                    <Table<any>
                        scroll={{ x: 'max-content' }}
                        title={() => <span>Dữ liệu:</span>}
                        dataSource={dataImport}
                        rowKey={() => crypto.randomUUID()}
                        columns={[
                            { dataIndex: 'ma_giay_cnqsh', title: 'Mã giấy CNQSH' },
                            { dataIndex: 'dt', title: 'Diện tích (m²)' },
                            { dataIndex: 'nam_bd_sdd', title: 'Năm bắt đầu SDD' },
                        ]}
                    />
                </div>
            </Modal>
        </Context.Provider>
    );
};

export default ModalImportDatdai;
