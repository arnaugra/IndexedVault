interface TextareaFieldProps {
    label: string,
    name: string,
    placeholder?: string,
    value?: string,
    action?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    optional?: boolean,
    error?: boolean
}

function TextareaField(props: TextareaFieldProps) {

    return (
    <label className="form-control w-full">
        <span className={`${props.error ? "text-error" : ""}`}>
        { props.label }
        </span>
        {props.optional && <span className="badge badge-neutral badge-xs">Optional</span>}
        <textarea name={props.name} placeholder={props.placeholder} value={props.value} onChange={props.action} className={`textarea textarea-bordered w-full ${props.error ? "input-error" : ""}`} />
    </label>
    );
}

export default TextareaField;
