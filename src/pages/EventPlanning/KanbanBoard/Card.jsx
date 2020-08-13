import React, {useState, useRef} from 'react';
import formatMarkdown from './formatMarkdown';
import CardModal from './CardModal';
import BoardContext from './context';
import styles from './Card.less';

const Card = (props) => {
  const [isModalOpen, toggleModal] = useState(false);
  const [cardStyle, setCardStyle] = useState('');
  const cardElement = useRef();
  // console.log(props);
  // const clickDelete = e => {
  //   onDelete();
  //   e.stopPropagation()
  // };
  return (
    <BoardContext.Consumer>
      {({eventBus, dispatch, data}) => {
        return (
          <>
            <div
              className={styles.card}
              style={props.cardStyle}
              ref={cardElement}
              onClick={() => toggleModal(!isModalOpen)}
            >
              <div
                className={styles.card_title}
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(props.title),
                }}
              />
              <div
                className={styles.card_body_html}
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(props.description),
                }}
              />
            </div>
            <CardModal
              isOpen={isModalOpen}
              cardStyle={props.cardStyle}
              cardElement={cardElement.current}
              {...props}
              data={data}
              eventBus={eventBus}
              dispatch={dispatch}
              toggleCardEditor={() => toggleModal(!isModalOpen)}
            />
          </>
        );
      }}
    </BoardContext.Consumer>
  );
};

export default Card;
