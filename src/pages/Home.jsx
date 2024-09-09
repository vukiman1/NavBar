import { Card, Col, Row, Typography } from "antd";
import {
  DollarTwoTone,
  UserAddOutlined,
  ShoppingTwoTone,
  ShopTwoTone,
} from "@ant-design/icons";
import Echart from "../components/chart/EChart";
import LineChart from "../components/chart/LineChart";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../Config/config";

function Home() {
  const { Title } = Typography;
  const { data: products } = useFetch(`${BASE_URL}/products`);
  const { data: users } = useFetch(`${BASE_URL}/users`);

  const count = [
    {
      today: "Doanh số hôm nay",
      title: "50.000vnđ",
      // persent: "+30%",
      icon: <DollarTwoTone style={{ fontSize: "46px" }} />,
      bnb: "bnb2",
    },
    {
      today: "Người dùng mới",
      title: users.length,
      persent: "+20%",
      icon: <UserAddOutlined style={{ fontSize: "46px", color: "#1677ff" }} />,
      bnb: "bnb2",
    },
    {
      today: "Đơn hàng hôm nay",
      title: "+8",
      persent: "-20%",
      icon: <ShoppingTwoTone style={{ fontSize: "46px" }} />,
      bnb: "redtext",
    },
    {
      today: "Tổng số sản phẩm",
      title: products.length,
      icon: <ShopTwoTone style={{ fontSize: "46px" }} />,
      bnb: "bnb2",
    },
  ];

  return (
    <>
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {count.map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              className="mb-24"
            >
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>{c.today}</span>
                      <Title level={3}>
                        {c.title} <small className={c.bnb}>{c.persent}</small>
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 0]} style={{ marginTop: "20px" }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Echart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
