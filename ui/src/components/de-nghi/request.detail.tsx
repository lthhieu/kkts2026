'use client'

import { Typography, Tag, Divider, Timeline, Descriptions, Alert, Image, Button, Input, message, notification } from 'antd';
import { STATUS_COLOR_MAP, STATUS_LABEL_MAP } from '@/components/de-nghi/table';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { handleAddComment } from '@/app/(main)/quan-tri/de-nghi/actions';
import { canCommentRequest } from '@/libs/request';

interface IProps {
    request: IRequestModule | null;
    access_token: string,
    onRefresh?: () => void,
    user: IUser | null
}
const Context = React.createContext({ name: 'Default' });

const RequestDetail = ({ request, access_token, onRefresh, user }: IProps) => {
    if (!request) return null;
    const [commentText, setCommentText] = useState<string>("")
    const [sending, setSending] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNotification] = notification.useNotification();
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    useEffect(() => {
        if (request === null) {
            setCommentText("")
        }
    }, [request])

    const submitComment = () => {
        setSending(true)
        setTimeout(async () => {
            const response = await handleAddComment(request._id, access_token, commentText)
            if (!response.data) {
                api.error({
                    title: `Có lỗi xảy ra`,
                    description: response.message,
                    placement: 'topRight',
                });
            }
            else {
                messageApi.success(response.message);
                setSending(false)
                setCommentText("")
                if (onRefresh) {
                    onRefresh();
                }
            }
        }, 1000)
    }

    return (
        <Context.Provider value={contextValue}>
            {contextHolder}{contextHolderNotification}
            <div style={{ padding: 8 }}>

                {/* ✅ Thông tin tổng thể */}
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="Tên đề nghị" span={2}>
                        <Typography.Text strong>{request.name}</Typography.Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Loại đề nghị">
                        <Tag color={request.type === 'Hư hỏng' ? 'blue' : 'red'}>
                            {request.type === 'Hư hỏng' ? 'Báo hỏng sửa chữa' : 'Đề nghị thanh lý'}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        <Tag color={STATUS_COLOR_MAP[request.status]}>
                            {STATUS_LABEL_MAP[request.status]}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Người gửi">
                        {request.createdBy}
                    </Descriptions.Item>

                    <Descriptions.Item label="Đơn vị">
                        {request.unit.name}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Thiết bị">
                        {request.device.name}
                    </Descriptions.Item>

                    <Descriptions.Item label="Thời gian tạo">
                        {dayjs(request.createdAt).format('HH:mm DD/MM/YYYY')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Cập nhật cuối">
                        {dayjs(request.updatedAt).format('HH:mm DD/MM/YYYY')}
                    </Descriptions.Item>
                </Descriptions>


                <Divider style={{ margin: '16px 0' }} />


                {/* ✅ Mô tả tình trạng */}
                <Typography.Title level={5}>Mô tả tình trạng</Typography.Title>
                <Typography.Paragraph>
                    {request.description}
                </Typography.Paragraph>


                {/* ✅ Ảnh minh họa - Chỉ hiện nếu có ảnh */}
                {request.image && <>
                    <Divider style={{ margin: '16px 0' }} />
                    <Typography.Title level={5}>Hình ảnh minh họa</Typography.Title>
                    <Image
                        src={request.image}
                        style={{ maxWidth: 500, borderRadius: 6 }}
                        preview
                    />
                </>}


                {/* ✅ Lý do từ chối - Chỉ hiện nếu bị từ chối */}
                {request.reason && <>
                    <Divider style={{ margin: '16px 0' }} />
                    <Alert
                        message="Đề nghị đã bị từ chối"
                        description={request.reason}
                        type="error"
                        showIcon
                    />
                </>}


                {/* ✅ Bình luận trao đổi - Chỉ hiện nếu có comment */}
                {request.comments?.length > 0 && <>
                    <Divider style={{ margin: '16px 0' }} />
                    <Typography.Title level={5}>Trao đổi / Bình luận</Typography.Title>

                    <Timeline
                        style={{ paddingLeft: 8 }}
                        items={request.comments.map(comment => ({
                            children: <>
                                <div style={{ marginBottom: 4 }}>
                                    <Typography.Text strong>{comment.createdBy}</Typography.Text>
                                    &nbsp;&nbsp;
                                    <Typography.Text type="secondary">
                                        {dayjs(comment.createdAt).format('HH:mm DD/MM/YYYY')}
                                    </Typography.Text>
                                </div>
                                <Typography.Paragraph style={{ margin: 0 }}>
                                    {comment.content}
                                </Typography.Paragraph>
                            </>
                        }))}
                    />
                </>}

                {canCommentRequest(user ?? {} as IUser) && <>
                    <Divider style={{ margin: '16px 0' }} />

                    <Input.TextArea
                        rows={2}
                        placeholder="Nhập bình luận / bổ sung thông tin..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        showCount
                        maxLength={500}
                    />

                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                        <Button
                            type="primary"
                            loading={sending}
                            disabled={!commentText.trim()}
                            onClick={submitComment}
                        >
                            Gửi bình luận
                        </Button>
                    </div>
                </>}

            </div>
        </Context.Provider>
    );
};

export default RequestDetail;