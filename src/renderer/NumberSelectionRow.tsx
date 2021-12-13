import { Row, Col, InputNumber } from 'antd';

interface Props {
  label: string;
  min: number;
  max?: number;
  defaultValue: number;
  onChange: (newNumber: number) => void;
}

const NumberSelectionRow = ({
  label,
  min,
  max,
  defaultValue,
  onChange,
}: Props) => {
  return (
    <Row style={{ width: '100%' }}>
      <Col span={10}>{label}</Col>
      <Col span={14}>
        <InputNumber
          min={min}
          max={max}
          defaultValue={defaultValue}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

NumberSelectionRow.defaultProps = {
  max: 3600,
};

export default NumberSelectionRow;
