import React, { useState } from 'react';
import Button from './Button/Button';
import styles from './ButtonGroup.module.css';

const buttonData = [
  {
    id: 1,
    h3: 'Yes',
    p: 'The Domain should exactly match the name',
  },
  {
    id: 2,
    h3: 'Yes',
    p: (
      <>
        But minor variations are allowed <br />
        (Recommended)
      </>
    ),
  },
  {
    id: 3,
    h3: 'No',
    p: 'I am looking for a name, not a Domain',
  },
];

const ButtonGroup = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (id) => {
    setActiveButton(id);
  };

  const renderButtons = () => {
    return buttonData.map((button) => (
      <Button
        key={button.id}
        h3={button.h3}
        p={button.p}
        isActive={activeButton === button.id}
        onClick={() => handleButtonClick(button.id)}
      />
    ));
  };

  return <div className={styles.div}>{renderButtons()}</div>;
};

export default ButtonGroup;
