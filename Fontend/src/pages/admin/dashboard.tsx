import { Card, Col, Row, Statistic } from "antd";
import CountUp from 'react-countup';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { fetchCompany } from "@/redux/slice/companySlide";
import { fetchJob } from "@/redux/slice/jobSlide";
import { fetchResume } from "@/redux/slice/resumeSlide";
const DashboardPage = () => {
    const dispatch=useAppDispatch();
    const [query,setQuery]=useState<string>("");
    const totalCompany = useAppSelector(state => state.company.meta.total);
    const totalJobs=useAppSelector(state => state.job.meta.total);
    const totalResume=useAppSelector(state => state.resume.meta.total);
    const formatter = (value: number | string) => {
        return (
            <CountUp end={Number(value)} separator="," />
        );
    };

    useEffect(()=>{
        dispatch(fetchCompany({query}));
        dispatch(fetchJob({query}))
        dispatch(fetchResume({query}))
    },[])
    return (
        <Row gutter={[20, 20]}>
            <Col span={24} md={8}>
                <Card title="Tổng số các công ty" bordered={false} >
                    <Statistic
                        title="Companies"
                        value={totalCompany}
                        formatter={formatter}
                    />

                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Tổng số việc làm" bordered={false} >
                    <Statistic
                        title="Jobs"
                        value={totalJobs}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Tổng số CV" bordered={false} >
                    <Statistic
                        title="Resumes"
                        value={totalResume}
                        formatter={formatter}
                    />
                </Card>
            </Col>

        </Row>
    )
}

export default DashboardPage;