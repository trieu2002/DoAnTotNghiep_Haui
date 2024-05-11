import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import { message, notification } from "antd";
import axios from "axios";
import { useEffect } from "react";
import {  } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import CountUp from 'react-countup';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
const LoginSocial=()=>{
    const {id}=useParams();
    let params = new URLSearchParams(location.search);
    const isAuthenticated = useAppSelector(state => state?.account.isAuthenticated);
    const dispatch=useAppDispatch();
    const callback = params?.get("callback");
    const handleLoginGoogle=async(id:string)=>{
        try {
              const res=await axios.post(`http://localhost:8000/api/v1/auth/loginGoogle`,{id});
              console.log('ress',res);
              if (res?.data) {
                localStorage.setItem('access_token', res.data.data.access_token);
                dispatch(setUserLoginInfo(res.data.data.user))
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
            console.log(error);
        }
    }
    useEffect(() => {
        console.log('dc goi');
        console.log('id',id);
        if(id){
            handleLoginGoogle(id);
        }
      });
    useEffect(() => {
        //đã login => redirect to '/'
        if (isAuthenticated) {
            // navigate('/');
            window.location.href = '/';
        }
    }, [])
    return(
        <>
        
         
        </>
    )
};
export default LoginSocial;