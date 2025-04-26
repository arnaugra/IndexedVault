import IconProps from "./IconProps";
import SVG from "./SVG";

function BreadcrumbSeparatorIcon(props: IconProps) {
    return (
        <SVG {...props}>
            <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z"></path>
        </SVG>
    );
}

export default BreadcrumbSeparatorIcon;
