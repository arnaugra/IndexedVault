import CloseIcon from "../svg/CloseIcon";

interface ModalComponentProps {
    children: React.ReactNode,
    open: boolean,
    onClose?: () => void,
};

function ModalComponent(props: ModalComponentProps) {
    return (
        <dialog className="modal" open={props.open}>
            <div className="modal-box">
                
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={props.onClose}><CloseIcon className="w-4 font-bold" stroke /></button>
                
                {props.children}
                
            </div>
        </dialog>
    );
}

export default ModalComponent;
