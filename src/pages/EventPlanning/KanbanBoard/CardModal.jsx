import Textarea from "react-textarea-autosize";

import Modal from "react-modal";
import React, {useState} from "react";
import {findCheckboxes , updateCard} from "./utils";
import styles from './CardModal.less';
import formatMarkdown from "./formatMarkdown";
import CardBadges from "./CardBadges";
import CardOptions from "./CardOptions";
import BoardContext from "@/pages/EventPlanning/KanbanBoard/context";

Modal.setAppElement("#root");
const CardModal =({date, description, cardElement, isOpen, toggleCardEditor, dispatch, data, laneId, id, title, eventBus, cardStyle, onDelete}) =>{
  const [isTextareaFocused, toggleTextareaFocused] = useState(true);
  const [isColorPickerOpen, toggleColorPicker] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const [newTitle, setNewTitle] = useState(title);
  if (!cardElement) {
    return null;
  }

  // Get number of checked and total checkboxes
  const checkboxes = findCheckboxes(description);

  /*
  Create style of modal in order to not clip outside the edges no matter what device.
  */
  const {childNodes} = cardElement;

  // Get dimensions of the card description to calculate dimensions of description.
  const boundingRect = cardElement.getBoundingClientRect();

  // Returns true if card is closer to right border than to the left
  const isCardNearRightBorder =
    window.innerWidth - boundingRect.right < boundingRect.left;

  // Check if the display is so thin that we need to trigger a centered, vertical layout
  // DO NOT CHANGE the number 550 without also changing related media-query in CardOptions.less
  const isThinDisplay = window.innerWidth < 550;

  // Position textarea at the same place as the card and position everything else away from closest edge
  const style = {
    content: {
      top: Math.min(
        boundingRect.top,
        window.innerHeight - boundingRect.height - 18
      ),
      left: isCardNearRightBorder ? null : boundingRect.left,
      right: isCardNearRightBorder
        ? window.innerWidth - boundingRect.right
        : null,
      flexDirection: isCardNearRightBorder ? "row-reverse" : "row"
    }
  };
  // For layouts that are less wide than 550px, let the modal take up the entire width at the top of the screen
  const mobileStyle = {
    content: {
      flexDirection: "column",
      top: 3,
      left: 3,
      right: 3
    }
  };
  const submitCard = () => {
    if (newDescription !== description) {
      const newData = updateCard(data, laneId, {id, description: newDescription});
      dispatch(newData)
      // eventBus.publish({type: 'UPDATE_CARD', landId, card:{id, title, Description: newDescription}})
    }else if (newTitle !== title){
      const newData = updateCard(data, laneId, {id, title: newTitle});
      dispatch(newData)
    }
    toggleCardEditor();
  };
  const handleKeyDown = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      submitCard();
    }
  };
  return(

    <Modal
      closeTimeoutMS={150}
      isOpen={isOpen}
      onRequestClose={toggleCardEditor}
      contentLabel="Card editor"
      overlayClassName={styles.modal_underlay}
      className={styles.modal}
      style={isThinDisplay ? mobileStyle : style}
      includeDefaultStyles={false}
      onClick={toggleCardEditor}
    >
      <div
        className={styles.modal_textarea_wrapper}
        style={{
          minHeight: isThinDisplay ? "none" : boundingRect.height,
          width: isThinDisplay ? "100%" : boundingRect.width,
          boxShadow: isTextareaFocused
            ? "0px 0px 3px 2px rgb(0, 180, 255)"
            : null,
          background: cardStyle? cardStyle.background : "white",
        }}
        // dangerouslySetInnerHTML={{__html: formatMarkdown(Description)}}
      >
      {/*  {(date || checkboxes.total > 0) && (*/}
      {/*  <CardBadges date={date} checkboxes={checkboxes}/>*/}
      {/*)}*/}
        <Textarea
          autoFocus
          cacheMeasurements
          // useCacheForDOMMeasurements
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.modal_textarea}
          spellCheck={false}
          onFocus={() => toggleTextareaFocused(true)}
          onBlur={() => toggleTextareaFocused(false)}
        />
        <Textarea
          autoFocus
          cacheMeasurements
          // useCacheForDOMMeasurements
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.modal_textarea}
          spellCheck={false}
          onFocus={() => toggleTextareaFocused(true)}
          onBlur={() => toggleTextareaFocused(false)}
        />
        {/*{(card.date || checkboxes.total > 0) && (*/}
        {/*  <CardBadges date={card.date} checkboxes={checkboxes}/>*/}
        {/*)}*/}
      </div>
      <CardOptions
        isColorPickerOpen={isColorPickerOpen}
        eventBus={eventBus}
        laneId={laneId}
        cardId={id}
        dispatch={dispatch}
        data={data}
        onDelete={onDelete}
        // card={card}
        // listId={listId}
        boundingRect={boundingRect}
        isCardNearRightBorder={isCardNearRightBorder}
        isThinDisplay={isThinDisplay}
        toggleColorPicker={()=>toggleColorPicker(!isColorPickerOpen)}
      />
    </Modal>
  )
};
export default CardModal;
