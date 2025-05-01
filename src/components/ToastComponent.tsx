import useErrorStore, { ErrorsType, ErrorsTypes } from "../stores/ErrorStore";
import CloseIcon from "../svg/CloseIcon";
import ToastErrorIcon from "../svg/ToastErrorIcon";
import ToastInfoIcon from "../svg/ToastInfoIcon";
import ToastWarningIcon from "../svg/ToastWarningIcon";

function ToastCompoennt() {
    const errors = useErrorStore((state) => state.errors);

    return (
        <>
            <div className="absolute max-md:left-3 bottom-3 md:bottom-10 right-3 md:right-10 flex flex-col items-end gap-3 z-50">
                {errors.map((error) => (
                    <ToastItem key={error.id} error={error} />
                ))}
            </div>
        </>
    );
}

function ToastItem({error}: {error: ErrorsType}) {

    const removeError = useErrorStore((state) => state.removeError);
    const { message, type, timestamp, id } = error;

    const maxToastTime = 1000 * 10; // 10 seconds

    setTimeout(() => {
        removeError(id);
    }, (timestamp + maxToastTime) - timestamp);

    return (
        <div role="alert" className={`alert alert-${type} w-full md:max-w-96 md:w-auto`}>
            {{
                [ErrorsTypes.info]: <ToastInfoIcon className="w-6" />,
                [ErrorsTypes.warning]: <ToastWarningIcon className="w-6" />,
                [ErrorsTypes.error]: <ToastErrorIcon className="w-6" />,
            }[type]}
            <span>{message}</span>
            <button className="btn btn-ghost btn-circle btn-xs" onClick={() => removeError(id)}><CloseIcon /></button>
        </div>
    );
}

export default ToastCompoennt;
