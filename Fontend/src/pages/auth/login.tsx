import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, redirect, useLocation, useNavigate, useParams } from 'react-router-dom';
import { callLogin, callLoginFacebook, callLoginGoogle } from 'config/api';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from 'styles/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';


const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch(); 
    const isAuthenticated = useAppSelector(state => state?.account.isAuthenticated);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");
    let id=params.get("id");
    let idF=params.get("idF");
    useEffect(() => {
        //đã login => redirect to '/'
        if (isAuthenticated) {
            // navigate('/');
            window.location.href = '/';
        }
        if (id) {

            handlerLoginGoogle(id);
            id=null;
        }
        if(idF){
            handlerLoginFacebook(idF);
            idF=null;
        }
    }, [])
   
    const handlerLoginGoogle=async(id:string)=>{
        try {
            
              const res=await callLoginGoogle(id);
              console.log('goi lan ',res);
              if (res?.data) {
                localStorage.setItem('access_token', res.data.access_token);
                dispatch(setUserLoginInfo(res.data.user))
                await message.success('Đăng nhập tài khoản thành công!');
                window.location.href = callback ? callback : '/';
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description:
                        res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5
                })
            }
        } catch (error) {
            console.log(error,"error");
        }
    }
    const handlerLoginFacebook=async(id:string)=>{
        try {
            
              const res=await callLoginFacebook(id);
              console.log('goi lan ',res);
              if (res?.data) {
                localStorage.setItem('access_token', res.data.access_token);
                dispatch(setUserLoginInfo(res.data.user))
                await message.success('Đăng nhập tài khoản thành công!');
                window.location.href = callback ? callback : '/';
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description:
                        res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5
                })
            }
        } catch (error) {
            console.log(error,"error");
        }
    }
    const onFinish = async (values: any) => {
        const { email, password } = values;
        setIsSubmit(true);
        const res = await callLogin(email, password);
        console.log('res',res);
        setIsSubmit(false);
        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user))
            await message.success('Đăng nhập tài khoản thành công!');
            window.location.href = callback ? callback : '/';
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };
    
    const handleLoginGoogle= ()=>{
        const newWindow = window.open(`http://localhost:8000/api/v1/auth/google`, "_self");
        console.log('dc goi lan 1');
        // Đợi 2 giây trước khi đóng cửa sổ
        setTimeout(() => {
            if (!newWindow || newWindow.closed) return;
             // Kiểm tra xem cửa sổ đã đóng hay không
            newWindow.close(); // Đóng cửa sổ
        }, 500);
    } 
    const handlerFacebook=()=>{
        const newWindow = window.open(`http://localhost:8000/api/v1/auth/facebook`, "_self");
        // Đợi 2 giây trước khi đóng cửa sổ
        setTimeout(() => {
            if (!newWindow || newWindow.closed) return;
             // Kiểm tra xem cửa sổ đã đóng hay không
            newWindow.close(); // Đóng cửa sổ
        }, 500);
    }
        
   
    return (
        <div className={styles["login-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles["text-large"]}`}>Đăng Nhập</h2>
                            <Divider />

                        </div>
                        <Form
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <div style={{ display: 'flex', justifyContent: 'center',gap:"20px",paddingBottom:"20px" }}>
                                    {/* Add Google login button */}
                                    <Button  style={{ color: 'red', borderColor: 'red' }} icon={<GoogleOutlined  />} size="large" onClick={handleLoginGoogle}>
                                     Google
                                    </Button>
                                    {/* Add Facebook login button */}
                                    <Button style={{ color: 'blue', borderColor: 'blue' }} icon={<FacebookOutlined  />} size="large" onClick={handlerFacebook}>
                                      Facebook
                                    </Button>
                            </div>
                            <p className="text text-normal">Chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng Ký </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage;