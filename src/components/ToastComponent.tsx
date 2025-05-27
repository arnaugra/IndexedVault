import useToastStore, { ToastType, ToastsTypes } from "../stores/ErrorStore";
import CloseIcon from "../svg/CloseIcon";
import ToastErrorIcon from "../svg/ToastErrorIcon";
import ToastInfoIcon from "../svg/ToastInfoIcon";
import ToastWarningIcon from "../svg/ToastWarningIcon";

function ToastCompoennt() {
    const { toasts } = useToastStore();

    return (
        <>
            <div className="absolute max-md:left-3 bottom-3 md:bottom-10 right-3 md:right-10 flex flex-col items-end gap-3 z-50">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </div>
        </>
    );
}

function ToastItem({toast}: {toast: ToastType}) {

    const { removeToast } = useToastStore();
    const { message, type, timestamp, id } = toast;

    const maxToastTime = 1000 * 10; // 10 seconds

    setTimeout(() => {
        removeToast(id);
    }, (timestamp + maxToastTime) - timestamp);

    return (
        <div role="alert" className={`alert alert-${type} w-full md:max-w-96 md:w-auto`}>
            {{
                [ToastsTypes.info]: <ToastInfoIcon className="w-6" />,
                [ToastsTypes.warning]: <ToastWarningIcon className="w-6" />,
                [ToastsTypes.error]: <ToastErrorIcon className="w-6" />,
            }[type]}
            <span>{message}</span>
            <button className="btn btn-ghost btn-circle btn-xs" onClick={() => removeToast(id)}><CloseIcon /></button>
        </div>
    );
}

export default ToastCompoennt;
