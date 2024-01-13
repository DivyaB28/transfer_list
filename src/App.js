import { isEmpty } from "lodash";
import "./scss/App.css";
import React, { useEffect, useState } from "react";

function App() {
  const [listItems, setListItems] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const { rightItems = [], leftItems = [] } = listItems;
  const items = [
    { val: 1, selected: false },
    { val: 2, selected: false },
    { val: 3, selected: false },
    { val: 4, selected: false },
  ];

  useEffect(() => {
    setListItems({
      leftItems: items,
      rightItems: [],
    });
    return () => {
      setSelectedItems([]);
    };
  }, []);

  function onChangeLeft(isChecked, val, selectedIndex) {
    let updatedListItems = leftItems.map((item) => {
      if (item.val === Number(val)) item.selected = isChecked;
      return item;
    });

    isChecked
      ? setSelectedItems([...selectedItems, leftItems[selectedIndex]])
      : setSelectedItems([...selectedItems.filter((item) => item.selected)]);
    setListItems({ ...listItems, leftItems: [...updatedListItems] });
  }

  function onChangeRight(isChecked, val, selectedIndex) {
    let updatedListItems = rightItems.map((item) => {
      if (item.val === Number(val)) item.selected = isChecked;
      return item;
    });
    isChecked
      ? setSelectedItems([...selectedItems, rightItems[selectedIndex]])
      : setSelectedItems([...selectedItems.filter((item) => item.selected)]);
    setListItems({ ...listItems, rightItems: [...updatedListItems] });
  }

  function updateRightList() {
    let updatedList = [];
    if (!isEmpty(rightItems)) {
      updatedList = [
        ...rightItems,
        ...leftItems.filter((item) => item.selected),
      ];
    } else {
      updatedList = [...leftItems.filter((item) => item.selected)];
    }
    return updatedList;
  }

  function handleShift(shiftDirection) {
    shiftDirection === "right"
      ? setListItems({
          leftItems: [
            ...leftItems.filter((item) => {
              return (
                selectedItems.findIndex(
                  (selectedItem) => selectedItem.val === item.val
                ) === -1
              );
            }),
          ],
          rightItems: updateRightList(),
        })
      : setListItems({
          leftItems: [
            ...leftItems,
            ...rightItems.filter((item) => item.selected),
          ],
          rightItems: [
            ...rightItems.filter((item) => {
              return (
                selectedItems.findIndex(
                  (selectedItem) => selectedItem.val === item.val
                ) === -1
              );
            }),
          ],
        });
  }

  return (
    <main>
      <h1>Transfer List App</h1>
      <div className="container">
        <div className="list">
          <TransferList listItems={leftItems} onChange={onChangeLeft} />
        </div>
        <div className="list">
          <p onClick={(e) => handleShift("left")}>{"<"}</p>
          <p onClick={(e) => handleShift("right")}>{">"}</p>
        </div>
        <div className="list">
          <TransferList listItems={rightItems} onChange={onChangeRight} />
        </div>
      </div>
    </main>
  );
}

function TransferList({ listItems, onChange = () => {} }) {
  return listItems ? (
    listItems.map(({ val, selected }, index) => {
      return (
        <div key={val} className="input_list">
          <input
            type="checkbox"
            value={val}
            checked={selected ? true : false}
            onChange={(e) => onChange(!selected, e.target.value, index)}
          />
          <span>{val}</span>
        </div>
      );
    })
  ) : (
    <></>
  );
}
export default App;
