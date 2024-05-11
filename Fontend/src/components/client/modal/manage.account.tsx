import { Button, Col, Form, Modal, Row, Select, Table, Tabs, message, notification,Input} from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callFetchResumeByUser, callGetSubscriberSkills, callUpdateProfile, callUpdateSubscriber } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MonitorOutlined } from "@ant-design/icons";
import { SKILLS_LIST } from "@/config/utils";
import { useAppSelector ,useAppDispatch} from "@/redux/hooks";
import { fetchAccount, setUserLoginInfo } from "@/redux/slice/accountSlide";
const { Option } = Select;
interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}
interface IProfile{
    name:string,
    email:string,
    age:number,
    gender:string,
    address:string
}

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data as IResume[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>)
            }
        },
        {
            title: 'Công Ty',
            dataIndex: ["companyId", "name"],

        },
        {
            title: 'Vị trí',
            dataIndex: ["jobId", "name"],

        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
        },
        {
            title: 'Ngày rải CV',
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
        },
        {
            title: '',
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/images/resume/${record?.url}`}
                        target="_blank"
                    >Chi tiết</a>
                )
            },
        },
    ];

    return (
        <div>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const UserUpdateInfo = (props: any) => {
    const [form] = Form.useForm();
    const dispatch=useAppDispatch();
    const user = useAppSelector(state => state.account.user);
    console.log('user1',user);
  
   const onFinish = async (values: any) => {
    // call api thay đổi thông tin người dùng
    const { name, email, age, gender, address }:IProfile = values;
    
        const res = await callUpdateProfile({ name,email,age,gender,address });
        console.log('res',res);
        if (res.data) {
            message.success("Cập nhật thông tin thành công");
            dispatch(setUserLoginInfo(values));
            
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: "Failed to update profile"
            });
        }
    
  }

    return (
        <>
             <Form
                onFinish={onFinish}
                form={form}
                initialValues={{
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    gender: user.gender,
                    address: user.address
                }}
                
            >
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                            label={"Tên"}
                            name={"name"}
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                        >
                            <Input placeholder="Nhập tên mới" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={"Email"}
                            name={"email"}  
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                        >
                            <Input placeholder="Nhập Email mới" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={"Tuổi"}
                            name={"age"}
                            rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
                        >
                            <Input placeholder="Nhập tuổi mới" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={"Giới tính"}
                            name={"gender"}
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        >
                            <Select
                                    // placeholder="Select a option and change input text above"
                                    // onChange={onGenderChange}
                                    allowClear
                                    defaultValue={user.gender}
                                >
                                    <Option value="male">Nam</Option>
                                    <Option value="female">Nữ</Option>
                                    <Option value="other">Khác</Option>
                                </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={"Địa chỉ"}
                            name={"address"}
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button type="primary" htmlType="submit">Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const JobByEmail = (props: any) => {
    const [form] = Form.useForm();
    const user = useAppSelector(state => state.account.user);

    useEffect(() => {
        const init = async () => {
            const res = await callGetSubscriberSkills();
            if (res && res.data) {
                form.setFieldValue("skills", res.data.skills);
            }
        }
        init();
    }, [])

    const onFinish = async (values: any) => {
        const { skills } = values;
        const res = await callUpdateSubscriber({
            email: user.email,
            name: user.name,
            skills: skills ? skills : []
        });
        if (res.data) {
            message.success("Cập nhật thông tin thành công");
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }

    }

    return (
        <>
            <Form
                onFinish={onFinish}
                form={form}
            >
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                            label={"Kỹ năng"}
                            name={"skills"}
                            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}

                        >
                            <Select
                                mode="multiple"
                                allowClear
                                showArrow={false}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <MonitorOutlined /> Tìm theo kỹ năng...
                                    </>
                                }
                                optionLabelProp="label"
                                options={SKILLS_LIST}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button onClick={() => form.submit()}>Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-resume',
            label: `Rải CV`,
            children: <UserResume />,
        },
        {
            key: 'email-by-skills',
            label: `Nhận Jobs qua Email`,
            children: <JobByEmail />,
        },
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo />,
        },
        
    ];


    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                    />
                </div>

            </Modal>
        </>
    )
}

export default ManageAccount;