import "./index.css";

const Input = ({ title, hint, id, mandatory = true, val='', setState, err }) => {
    return (
        <>
            <div className="input_title">
                {title}
                {mandatory ? "*" : ""}
            </div>
            <input
                id={id}
                className="input_input"
                type="text"
                placeholder={hint}
                value={val}
                onInput={(e) => {
                    setState(e.target.value);
                }}
            />
            {err && <div className="input_error">{err}</div>}
        </>
    );
};

export default Input;
