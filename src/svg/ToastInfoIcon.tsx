import IconProps from "./IconProps";
import SVG from "./SVG";

function ToastInfoIcon(props: IconProps) {
    return (
        <SVG {...props}>
            <path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8"></path>
        </SVG>
    );
}

export default ToastInfoIcon;
