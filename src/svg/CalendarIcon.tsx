import IconProps from "./IconProps";
import SVG from "./SVG";

function CalendarIcon(props: IconProps) {
    return (
        <SVG {...props}>
            <path fill="currentColor" d="M20 3h-1V2c0-.55-.45-1-1-1s-1 .45-1 1v1H7V2c0-.55-.45-1-1-1s-1 .45-1 1v1H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-1 18H5c-.55 0-1-.45-1-1V8h16v12c0 .55-.45 1-1 1"></path>
        </SVG>
    )
}

export default CalendarIcon;
