interface InputFieldProps {
  label: string,
  type?: string,
  name: string,
  placeholder?: string,
  value?: string,
  action?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  optional?: boolean
  error?: boolean
  width?: string
  autocomplete?: string
}

function InputField(props: InputFieldProps) {
  
  return (
    <label className={`form-control ${props.width ?? "w-full"}`}>
        <span className={`${props.error ? "text-error" : ""}`}>
          { props.label }
        </span>
        { props.optional && <span className="badge badge-neutral badge-xs">Optional</span> }
        <input className={`input join-item w-full ${props.error ? "input-error" : ""}`} type={ props.type } name={ props.name } placeholder={ props.placeholder } value={ props.value ?? "" } onChange={props.action} autoComplete={props.autocomplete ?? "on"} />
    </label>
  );
}

export default InputField;
