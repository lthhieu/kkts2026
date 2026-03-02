"use client"
import { Modal, message, notification, Upload, UploadProps, Table } from 'antd';
import React, { useMemo, useState } from 'react';
import { handleCreateMany } from '@/app/(main)/quan-tri/thiet-bi/actions';
import { InboxOutlined } from '@ant-design/icons';
// import sampleFile from '@public/sample/sample-unit.xlsx'
import * as Excel from 'exceljs';


interface IProps {
    access_token?: string,
    isModalImportOpen: boolean,
    setIsModalImportOpen: (value: boolean) => void,
}

interface IUpload {
    name: string
}

const { Dragger } = Upload;

const Context = React.createContext({ name: 'Default' });


const ModalImport = (props: IProps) => {
    const { access_token, isModalImportOpen, setIsModalImportOpen } = props
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);
    const [dataImport, setDataImport] = useState<IUpload[]>([])
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
                message.error(`${file.name} không phải file xlsx hoăc csv`);
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

                    // Duyệt từ dòng 3 (bỏ qua dòng 1 gợi ý và dòng 2 key)
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber <= 2) return;

                        // Hàm hỗ trợ lấy giá trị đơn thuần (loại bỏ object nếu ô đó là link/formula)
                        const getVal = (colIndex: any) => {
                            const cell = row.getCell(colIndex);
                            // Nếu là ô merge hoặc công thức, cell.value có thể là object {result: ...}
                            return cell.value;
                        };

                        // Build object theo cấu trúc bạn yêu cầu
                        const obj = {
                            name: getVal(1),         // Cột A
                            description: getVal(2) || "",  // Cột B
                            usedLocation: [
                                {
                                    year: Number(getVal(4)), // Cột D: Năm SD
                                    room: String(getVal(3) || "") // Cột C: Nơi SD
                                }
                            ],
                            usedYear: Number(getVal(4)),
                            soKeToan: {
                                soLuong: Number(getVal(5)) || 0,
                                nguyenGia: Number(getVal(6)) || 0,
                                giaTriConLai: getVal(7) || null
                            },
                            kiemKe: {
                                soLuong: Number(getVal(8)) || 0,
                                nguyenGia: Number(getVal(9)) || 0,
                                giaTriConLai: getVal(10) || null
                            },
                            chenhLech: {
                                thua: Number(getVal(11)) || 0,
                                thieu: Number(getVal(12)) || 0,
                                giaTriConLai: getVal(13) || null
                            },
                            chatLuongConLai: Number(getVal(14)) || 0,
                            note: getVal(15) || "",
                            unit: String(getVal(16) || ""),
                            type: String(getVal(17) || ""),
                            trongSoChatLuong: Number(getVal(18)) || 0,
                            parent: getVal(19) || null
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
            // console.log('Dropped files', e.dataTransfer.files);
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
                maskClosable={false}
            >
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Chọn hoặc kéo thẻ file để tải dữ liệu</p>
                    <p className="ant-upload-hint">
                        Chỉ hỗ trợ file excel và csv
                        &nbsp;<a onClick={(e) => e.stopPropagation()} href={`${process.env.NEXT_PUBLIC_FRONTEND_URI}sample/sample-device.xlsx`} download>Tải file mẫu</a>
                    </p>
                </Dragger>
                <div>
                    <Table<any>
                        scroll={{ x: "max-content" }}
                        title={() => <span>Dữ liệu:</span>}
                        dataSource={dataImport} rowKey={(_) => crypto.randomUUID()}
                        columns={[
                            { dataIndex: 'name', title: 'Tên thiết bị' },
                            { dataIndex: 'description', title: 'Mô tả/Mã số' },
                            { dataIndex: 'usedYear', title: 'Năm sử dụng' }
                        ]} />
                </div>
            </Modal>
        </Context.Provider>
    );
};

export default ModalImport;