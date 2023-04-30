import { useMemo } from 'react';
import { groupBy } from 'lodash';

import { NodeGroupName, NodeConfigItem, nodeConfig } from '../node-config';

const isConfigItemContainsText = (item: NodeConfigItem, text: string) => {
  const itemText = [item.description, item.title].join(' ').toLocaleLowerCase();

  return itemText.includes(text.toLowerCase());
};

type UseGroupedNodes = {
  text: string;
  group: NodeGroupName | null;
};

export const useGroupedNodes = ({ text, group }: UseGroupedNodes) => {
  return useMemo(() => {
    const filteredBySearch = text ? nodeConfig.filter((item) => isConfigItemContainsText(item, text)) : nodeConfig;
    const filterByGroup = group ? filteredBySearch.filter((item) => item.group === group) : filteredBySearch;

    return groupBy(filterByGroup, 'group');
  }, [group, text]);
};
