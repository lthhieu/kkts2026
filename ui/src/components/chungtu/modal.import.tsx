"use client"
import { Modal, message, notification, Upload, UploadProps, Table, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import * as Excel from 'exceljs';
import { handleCreateMany } from '@/app/(main)/quan-tri/chung-tu/actions';
import dayjs from 'dayjs';


interface IProps {
    access_token?: string,
    isModalImportOpen: boolean,
    setIsModalImportOpen: (value: boolean) => void,
}

const { Dragger } = Upload;

const Context = React.createContext({ name: 'Default' });

const ModalImport = (props: IProps) => {
    const { access_token, isModalImportOpen, setIsModalImportOpen } = props
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [dataImport, setDataImport] = useState<IChungtu[]>([])
    const [confirmLoading, setConfirmLoading] = useState(false);

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        //only csv or xlsx
        beforeUpload: (file) => {
            const typeCheck = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
            const isValidate = typeCheck.some((element) => element === file.type);
            if (!isValidate) {
                message.error(`${file.name} không phải file excel hoăc csv`);
            }
            return isValidate || Upload.LIST_IGNORE;
        },

        //prevent call action
        customRequest: ({ onSuccess }) => {
            if (onSuccess) {
                onSuccess("ok");
            }
        },
        async onChange(info) {
            const { status } = info.file;

            // Nếu bạn không có backend để upload, AntD sẽ để status là 'uploading' hoặc undefined.
            // Để an toàn, chúng ta xử lý khi status là 'done' HOẶC khi file đã được chọn (nếu dùng customRequest)
            if (status === 'done' || info.fileList.length > 0) {
                try {
                    const arrayBuffer = await info.file.originFileObj!.arrayBuffer();
                    const workbook = new Excel.Workbook();
                    await workbook.xlsx.load(arrayBuffer);

                    // Lấy sheet đầu tiên
                    const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];
                    if (!worksheet) {
                        console.error("Không tìm thấy worksheet");
                        return;
                    }

                    let jsonData: any[] = [];

                    // Duyệt từ dòng 2
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber <= 1) return;

                        // Hàm hỗ trợ lấy giá trị đơn thuần (loại bỏ object nếu ô đó là link/formula)
                        const getVal = (colIndex: any) => {
                            const cell = row.getCell(colIndex);
                            // Nếu là ô merge hoặc công thức, cell.value có thể là object {result: ...}
                            return cell.value;
                        };

                        // Build object theo cấu trúc bạn yêu cầu

                        const obj = {
                            ngaynhan: dayjs(String(getVal(1))).toDate(),
                            noidung: getVal(2) ? String(getVal(2)) : "-",
                            sotien: Number(getVal(3)) || 0,
                            ngayhoanthanh: getVal(4)
                                ? dayjs(String(getVal(4))).toDate()
                                : null,
                            ghichu: getVal(5) ? String(getVal(5)) : "-",
                            tienbangchu: getVal(6) ? String(getVal(6)) : "-",
                            trangthai: getVal(7) ? String(getVal(7)) : "Chưa xác định",
                            ncc: getVal(8) ? String(getVal(8)) : null,
                        };

                        jsonData.push(obj);
                    });

                    console.log("Dữ liệu cuối cùng:", jsonData);
                    setDataImport(jsonData);

                    if (status === 'done') {
                        message.success(`${info.file.name} tải lên thành công`);
                    }
                } catch (error) {
                    console.error("Lỗi đọc file:", error);
                    message.error("Có lỗi khi đọc file Excel");
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} tải lên thất bại`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(async () => {
            const response = await handleCreateMany(dataImport, access_token ?? '')

            if (response.data) {
                messageApi.success(response.message);
                handleCancel()
            } else {
                api.error({
                    title: `Có lỗi xảy ra`,
                    description: response.message,
                    placement: 'topRight',
                });

            }
            setConfirmLoading(false);
        }, 2000)
    };

    const handleCancel = () => {
        setDataImport([])
        setIsModalImportOpen(false);
    };

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <Modal
                title={"Import dữ liệu"}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalImportOpen}
                onOk={handleOk}
                okText={"Import"}
                cancelText={"Hủy"}
                onCancel={handleCancel}
                okButtonProps={{ disabled: dataImport.length !== 0 ? false : true }}
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
                        Chỉ hỗ trợ file excel và csv <a onClick={(e) => e.stopPropagation()} href={`${process.env.NEXT_PUBLIC_FRONTEND_URI}sample/sample-chungtu.xlsx`} download>Tải file mẫu</a>
                    </p>
                </Dragger>
                <div>
                    <Table<IChungtu>
                        scroll={{ x: "max-content" }}
                        title={() => <span>Dữ liệu:</span>}
                        dataSource={dataImport} rowKey={'noidung'}
                        columns={[
                            {
                                dataIndex: 'ngaynhan', title: 'ngaynhan',
                                render: (_, record) => (
                                    <Typography.Text >{record?.ngaynhan ? dayjs(record?.ngaynhan).format('DD/MM/YYYY') : '-'}</Typography.Text>
                                )
                            },
                            { dataIndex: 'noidung', title: 'Nội dung' },
                            { dataIndex: 'sotien', title: 'Số tiền' },
                            {
                                dataIndex: 'ngayhoanthanh', title: 'Ngày hoàn thành',
                                render: (_, record) => (
                                    <Typography.Text >{record?.ngayhoanthanh ? dayjs(record?.ngayhoanthanh).format('DD/MM/YYYY') : '-'}</Typography.Text>
                                )
                            },
                            { dataIndex: 'ghichu', title: 'Ghi chú' },
                            { dataIndex: 'tienbangchu', title: 'Tiên bằng chữ' },
                            { dataIndex: 'trangthai', title: 'Trạng thái' },
                            { dataIndex: 'ncc', title: 'Nhà cung cấp' },
                        ]} />
                </div>
            </Modal>
        </Context.Provider>
    );
};

export default ModalImport;