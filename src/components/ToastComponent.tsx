import useErrorStore, { ErrorType } from "../stores/ErrorStore";

function ToastCompoennt() {
    const errors = useErrorStore((state) => state.errors);

    return (
        <>
            <div className="absolute bottom-10 right-10 flex flex-col gap-4 z-50">
                {errors.map((error) => (
                    <ToastItem key={error.id} error={error} />
                ))}
            </div>
        </>
    );
}

function ToastItem({error}: {error: ErrorType}) {

    const removeError = useErrorStore((state) => state.removeError);
    const { message, type, timestamp, id } = error;

    const maxToastTime = 1000 * 1; // 10 seconds

    setTimeout(() => {
        
        removeError(id);
    }, (timestamp + maxToastTime) - timestamp);

    return (
        <div role="alert" className="alert">
            {type}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{message}</span>
        </div>
    );
}

export default ToastCompoennt;
