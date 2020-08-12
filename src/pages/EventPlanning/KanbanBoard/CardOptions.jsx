import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { FaTrash } from 'react-icons/fa';
import { MdAccessAlarm } from 'react-icons/md';
import Calendar from './Calendar';
import ClickOutside from './ClickOutside';
import colorIcon from '../../../assets/images/color-icon.png';
import styles from './CardOptions.less';
import BoardContext from './context';
import { updateCard } from './utils';

class CardOptions extends Component {
  static propTypes = {
    isColorPickerOpen: PropTypes.bool.isRequired,
    // card: PropTypes.shape({ _id: PropTypes.string.isRequired }).isRequired,
    // listId: PropTypes.string.isRequired,
    isCardNearRightBorder: PropTypes.bool.isRequired,
    isThinDisplay: PropTypes.bool.isRequired,
    boundingRect: PropTypes.object.isRequired,
    toggleColorPicker: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = { isCalendarOpen: false };
  }

  deleteCard = () => {
    const { dispatch, listId, data, onDelete } = this.props;
    onDelete;
    // dispatch({
    //   type: "DELETE_CARD",
    //   payload: { cardId: card._id, listId }
    // });
  };

  changeColor = (color) => {
    const { dispatch, eventBus, laneId, cardId, toggleColorPicker, data } = this.props;
    dispatch(updateCard(data, laneId, { id: cardId, cardStyle: { background: color } }), false);
    // eventBus.publish({type: 'UPDATE_CARD', landId, card:{id: cardId, style: {backgroundColor: color}}});
    // if (card.color !== color) {
    //   eventBus.publish({type: 'UPDATE_CARD', landId, card:{id: cardId, style: {backgroundColor: color}}})
    // }
    toggleColorPicker();
    this.colorPickerButton.focus();
  };

  handleKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.props.toggleColorPicker();
      this.colorPickerButton.focus();
    }
  };

  handleClickOutside = () => {
    const { toggleColorPicker } = this.props;
    toggleColorPicker();
    this.colorPickerButton.focus();
  };

  toggleCalendar = () => {
    this.setState({ isCalendarOpen: !this.state.isCalendarOpen });
  };

  render() {
    const {
      isCardNearRightBorder,
      isColorPickerOpen,
      toggleColorPicker,
      card,
      isThinDisplay,
      boundingRect,
      onDelete,
    } = this.props;

    console.log(this.props);

    const { isCalendarOpen } = this.state;

    const calendarStyle = {
      content: {
        top: Math.min(boundingRect.bottom + 10, window.innerHeight - 300),
        left: boundingRect.left,
      },
    };

    const calendarMobileStyle = {
      content: {
        top: 110,
        left: '50%',
        transform: 'translateX(-50%)',
      },
    };
    return (
      <div
        className={styles.options_list}
        style={{
          alignItems: isCardNearRightBorder ? 'flex-end' : 'flex-start',
        }}
      >
        <div>
          <button onClick={() => onDelete()} className={styles.options_list_button}>
            <div className={styles.modal_icon}>
              <FaTrash />
            </div>
            &nbsp;Delete
          </button>
        </div>
        <div className={styles.modal_color_picker_wrapper}>
          <button
            className={styles.options_list_button}
            onClick={toggleColorPicker}
            onKeyDown={this.handleKeyDown}
            ref={(ref) => {
              this.colorPickerButton = ref;
            }}
            aria-haspopup
            aria-expanded={isColorPickerOpen}
          >
            <img src={colorIcon} alt="colorwheel" className={styles.modal_icon} />
            &nbsp;Color
          </button>
          {isColorPickerOpen && (
            <ClickOutside eventTypes="click" handleClickOutside={this.handleClickOutside}>
              {/* eslint-disable */}
              <div className={styles.modal_color_picker} onKeyDown={this.handleKeyDown}>
                {/* eslint-enable */}
                {['white', '#6df', '#6f6', '#ff6', '#fa4', '#f66'].map((color) => (
                  <button
                    key={color}
                    style={{ background: color }}
                    className={styles.color_picker_color}
                    onClick={() => this.changeColor(color)}
                  />
                ))}
              </div>
            </ClickOutside>
          )}
        </div>
        <div>
          <button onClick={this.toggleCalendar} className={styles.options_list_button}>
            <div className={styles.modal_icon}>
              <MdAccessAlarm />
            </div>
            &nbsp;Due date
          </button>
        </div>
        <Modal
          isOpen={isCalendarOpen}
          onRequestClose={this.toggleCalendar}
          overlayClassName={styles.calendar_underlay}
          className={styles.calendar_modal}
          style={isThinDisplay ? calendarMobileStyle : calendarStyle}
        >
          {/*<Calendar*/}
          {/*  cardId={card.id}*/}
          {/*  date={card.date}*/}
          {/*  toggleCalendar={this.toggleCalendar}*/}
          {/*/>*/}
        </Modal>
      </div>
    );
  }
}

export default CardOptions;
