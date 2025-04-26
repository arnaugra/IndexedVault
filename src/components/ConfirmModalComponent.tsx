interface ConfirmModalComponentProps {
    children: React.ReactNode;
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

function ConfirmModalComponent ( props: ConfirmModalComponentProps) {
    return (
        <dialog className="modal" open={props.open}>
            <div className="modal-box">
            
                <div className="p-5 flex flex-col gap-4">
                    {props.children}
                </div>

                <div className="flex justify-evenly pt-5">
                    <button className="btn btn-sm w-2/5" onClick={props.onConfirm}>Confirm</button>
                    <button className="btn btn-sm btn-error w-2/5" onClick={props.onCancel}>Cancel</button>
                </div>

            </div>
        </dialog>
    );
}

export default ConfirmModalComponent;