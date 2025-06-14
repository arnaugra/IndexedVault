import IconProps from "./IconProps";
import SVG from "./SVG"

function GitHubIssueIcon(props: IconProps) {
    return (
        <SVG {...props} >
            <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8"/>{/* circle */}
            <path fill="currentColor" d="M14 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0z"></path>



 {/* dot */}

        </SVG>
    );
}

export default GitHubIssueIcon;
