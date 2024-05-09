import SearchClient from '@/components/client/search.client';
import { Col, Divider, Row } from 'antd';
import styles from 'styles/client.module.scss';
import JobCard from '@/components/client/card/job.card';
import { useState } from 'react';

const ClientJobPage = (props: any) => {
    const [searchQuery,setSearchQuery]=useState<string>("");
    const handleSearchQuery=(values:any)=>{
        setSearchQuery(values);
    }
    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <SearchClient handleSearchQuery={handleSearchQuery} />
                </Col>
                <Divider />

                <Col span={24}>
                    <JobCard
                        showPagination={true}
                        searchQuery={searchQuery}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientJobPage;