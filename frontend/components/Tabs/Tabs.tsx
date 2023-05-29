import React, { useState } from 'react';

type TabItem = {
  props: {
    title: string;
    children: React.ReactNode;
  };
};

type TabsProps = {
  children: Array<TabItem>;
};

const Tabs = ({ children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleClick = (tab: number) => {
    setActiveTab(tab);
  };

  const selectedClassName = 'font-bold inline-block p-4 border-b-2';
  const unselectedClassName =
    'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';

  return (
    <div className="text-jb-subheadings text-center">
      <div className="flex flex-wrap -mb-px">
        {children.map((child, index: number) => {
          const { title } = child.props;

          return (
            <div
              className={activeTab === index ? selectedClassName : unselectedClassName}
              role="button"
              tabIndex={index}
              key={title}
              onClick={() => handleClick(index)}
            >
              {title}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col px-8 items-center">{children[activeTab].props.children}</div>
    </div>
  );
};

export default Tabs;