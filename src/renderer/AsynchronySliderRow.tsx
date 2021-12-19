import { Col, Row, Slider } from 'antd';

type Props = {
  onChange: (groupSize: number) => void;
};

const AsynchronySliderRow = ({ onChange }: Props) => {
  return (
    <Row style={{ width: '100%' }}>
      <Col span={10}>Async Size</Col>
      <Col span={14}>
        <Slider min={1} max={20} onChange={onChange} />
      </Col>
    </Row>
  );
};

export default AsynchronySliderRow;
