import React, { useState } from "react";
import { Collapse, Checkbox } from "antd";

const { Panel } = Collapse;

function CheckBox(props) {
  const [Checked, setChecked] = useState([]);

  const handleToggle = (value) => {
    //checked 의 value 가져옴
    const currentIndex = Checked.indexOf(value);

    const newChecked = [...Checked];

    //없으면 넣는다
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      //checked된 state에서 현재 누른 checked가 있다면 빼고
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    props.handleFilters(newChecked);
  };

  const renderCheckboxList = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => handleToggle(value._id)}
          checked={Checked.indexOf(value._id) === -1 ? false : true}
        />
        <span>{value.name}</span>
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="Continents" key="1">
          {renderCheckboxList()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
