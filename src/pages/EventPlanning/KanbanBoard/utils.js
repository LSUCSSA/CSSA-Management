// Return the total number of checkboxes and the number of checked checkboxes inside a given text
export const findCheckboxes = text => {
  const checkboxes = text.match(/\[(\s|x)\]/g) || [];
  const checked = checkboxes.filter(checkbox => checkbox === "[x]").length;
  return { total: checkboxes.length, checked };
};

export const updateCard = (data, laneId, param) =>{
  const newData = data.lanes.map(lane => {
    if (lane.id === laneId){
      const newLanes = lane.cards.map(card => {
        if(card.id === param.id){
          return {...card, ...param}
        }
        return card
      });
      return {...lane, cards: newLanes}
    }
    return lane
  });
  return {lanes: newData}
};

