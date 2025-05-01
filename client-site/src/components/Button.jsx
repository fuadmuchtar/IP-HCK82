export default function Button(props){
    const { type="button", onClick, variant, title, style } = props;
    return (
        <button type={type} className={`btn ${variant}`} onClick={onClick} style={style}>
            {title}
        </button>
    )
}