

const Header = (props) =>{
  console.log(props)
  return (
    <header style={{color: "white", fontSize: 16}}>
      <div>
        {props.editLaneTitle ?
          <input value={props.title} border placeholder={t('placeholder.title')} resize='vertical' onSave={updateTitle} /> :
          title
      </div>
      {

        props.title
      }
    </header>
  )
};
export default Header;
