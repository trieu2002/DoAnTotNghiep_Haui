import { Button, Col, Form, Row, Input } from 'antd';
import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { LOCATION_LIST, SKILLS_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';

const SearchClient = ({handleSearchQuery}:{handleSearchQuery:(values:any)=> void}) => {
    const optionsSkills = SKILLS_LIST;
    const optionsLocations = LOCATION_LIST;
    const [form] = Form.useForm();


    const onFinish = async (values: any) => {
        console.log('values',values);
         handleSearchQuery(values);
    }

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={
                {
                    render: () => <></>
                }
            }
        >
            <Row gutter={[20, 20]}>
                <Col span={24}><h2>Việc Làm IT Cho Developer "Chất"</h2></Col>
                <Col span={24} md={6}>
                    <ProForm.Item
                        name="name"
                    >
                        <Input
                           
                            allowClear
                           
                            style={{ width: '100%' }}
                            placeholder='Tìm kiếm theo tên công việc'
                            prefix={ <MonitorOutlined />}
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={5}>
                    <ProForm.Item name="skills">
                    <Input
                           
                           allowClear
                          
                           style={{ width: '100%' }}
                           placeholder='Tìm kiếm theo kí năng'
                           prefix={ <MonitorOutlined />}
                       />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={5}>
                    <ProForm.Item name="location">
                    <Input
                           
                           allowClear
                          
                           style={{ width: '100%' }}
                           placeholder='Tìm kiếm theo địa chỉ'
                           prefix={ <EnvironmentOutlined />}
                       />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <Button type='primary' onClick={() => form.submit()}>Search</Button>
                </Col>
            </Row>
        </ProForm>
    )
}
export default SearchClient;