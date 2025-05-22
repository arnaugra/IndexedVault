import { useState } from "react";
import ConfirmModalComponent from "../../components/ConfirmModalComponent";
import { Value } from "../../db/Value";
import useValuesStore from "../../stores/ValuesStore"
import useValueStore, { ValueTypes } from "../../stores/ValueStore";
import BinIcon from "../../svg/BinIcon";
import EditIcon from "../../svg/EditIcon";
import CopyIcon from "../../svg/CopyIcon";
import TextIcon from "../../svg/TextIcon";
import PasswordIcon from "../../svg/PasswordIcon";
import CalendarIcon from "../../svg/CalendarIcon";
import useEncryptStore from "../../stores/EncryptStore";
import { decrypt } from "../../utils/encrypt";
import LockOpenIcon from "../../svg/LockOpenIcon";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { ValueI } from "../../db/interfaces";
import DragIcon from "../../svg/DragIcon";

function ValuesTable(props: {section_id: number}) {

    const values = useValuesStore((state) => state.values);
    const setValues = useValuesStore((state) => state.setValues);

    const { draggedItem, onDragStart, onDragEnd, onDragOver, onDrop, reorderItems } = useDragAndDrop<ValueI>();

    const setValueIdToEdit = useValueStore((state) => state.setValueIdToEdit);
    const setOpenNewValue = useValueStore((state) => state.setOpenNewValue);

    const [valueIdToDelete, setValueIdToDelete] = useState<number | null>(null);

    const encryptionKey = useEncryptStore((state) => state.encryptionKey);

    const handleReorder = (target: ValueI): React.DragEventHandler => {
        return onDrop(target, async (from, to) => {
            
            console.log("Dropped", from.id, "->", to.id);
            const updated = reorderItems(values, from, to);
            for (const value of updated) {
                await new Value().update(value.id!, { order: value.order });
            }
            setValues(props.section_id);
        });
    };

    const deleteValue = async (id: number) => {
        await Value.delete(id);
        setValues(props.section_id);
        setValueIdToDelete(null);
    }

    const dateFormat = (date: string) => new Date(date).toLocaleDateString('en-GB');
    const isDraging = (valueId: number) => draggedItem?.id === valueId ? 'dragging' : 'not-dragging'
    const colwidths = [
        "flex w-3/12 px-4 py-3",
        "flex w-9/12 px-4 py-3",
        "flex w-2/12 px-4 py-3",
        "flex w-1/12 px-4 py-3"
    ];

    return (
        <>
            {
                values.length === 0 
                    ?   <p className="text-gray-600">No values found.</p>
                    :   <div className="w-full">
                            <section role="row" data-section="header" className="flex gap-2 text-sm bg-base-200 text-base-content/60 font-bold">
                                <article role="cell" className={`${colwidths[0]}`}>Name</article>
                                <article role="cell" className={`${colwidths[1]}`}>Value</article>
                                <article role="cell" className={`${colwidths[2]}`}>Expiration Date</article>
                                <article role="cell" className={`${colwidths[3]}`}>Actions</article>
                            </section>

                            {values.map((value, index) => (
                                <section role="row" data-section={`value-${value.id}`} key={value.id} className={`flex text-sm ${draggedItem ? isDraging(value.id as number) : ''} not-last:border-b not-last:border-base-content/5`}
                                onDragEnd={ onDragEnd }
                                onDragOver={ onDragOver }
                                onDrop={ handleReorder(value) }
                                >
                                    <article role="cell" data-column={`value-${value.id}-name`} className={`${colwidths[0]} font-bold flex items-center gap-2`}>
                                        <div className="shrink-0 text-gray-500"
                                            draggable
                                            onDragStart={ onDragStart(value) }
                                        >
                                            <DragIcon className="w-5 cursor-grab"/>
                                        </div>
                                        <span className="text-wrap">{value.name}</span>
                                    </article>
                                    <article role="cell" data-column={`value-${value.id}-value`} className={`${colwidths[1]}`}>
                                        <div className="flex gap-2 items-center">
                                            {{
                                                [ValueTypes.TEXT]:
                                                    <>
                                                        <div className="tooltip" data-tip={ValueTypes.TEXT}>
                                                            <TextIcon className="w-4 text-gray-500" />
                                                        </div>
                                                        <div className="divider divider-horizontal mx-0.5"></div>
                                                        <span>{value.value}</span>
                                                    </>,
                                                [ValueTypes.DATE]:
                                                    <>
                                                        <div className="tooltip" data-tip={ValueTypes.DATE}>
                                                            <CalendarIcon className="w-4 text-gray-500" />
                                                        </div>
                                                        <div className="divider divider-horizontal mx-0.5"></div>
                                                        <span>{dateFormat(value.value as string)}</span>
                                                    </>,
                                                [ValueTypes.PASSWORD]:
                                                    <>
                                                        <div className="tooltip" data-tip={ValueTypes.PASSWORD}>
                                                            <PasswordIcon className="w-4 text-gray-500" />
                                                        </div>
                                                        <div className="divider divider-horizontal mx-0.5"></div>
                                                        <span>{value.value.substring(0,35)}{value.value.length > 35 ? "..." : ""}</span>

                                                        {encryptionKey
                                                            ?   (<button className="btn btn-ghost btn-circle btn-xs" onClick={async () => navigator.clipboard.writeText(await decrypt(value.value as string, encryptionKey) as string)}>
                                                                    <CopyIcon className="w-4 mt-1 cursor-pointer" />
                                                                </button>)
                                                            :   (<div className="btn btn-ghost btn-circle btn-xs tooltip" data-tip="Add Encryption Key">
                                                                    <LockOpenIcon className="w-4 mt-1 text-error cursor-pointer" />
                                                                    </div>)
                                                        }
                                                    </>,

                                            }[value.type]}

                                            {ValueTypes.PASSWORD !== value.type && 
                                                <button className="btn btn-ghost btn-circle btn-xs" onClick={() => navigator.clipboard.writeText(value.value as string)}>
                                                    <CopyIcon className="w-4 mt-1 cursor-pointer" />
                                                </button>}

                                        </div>
                                    </article>
                                    <article role="cell" data-column={`value-${value.id}-expirationDate`} className={`${colwidths[2]} whitespace-nowrap`}>
                                        <div className="flex gap-2 items-center m-auto">
                                            {value.expirationDate && (() => {
                                                const now = new Date();
                                                const expiration = new Date(value.expirationDate);
                                                const diffMs = expiration.getTime() - now.getTime();
                                                const diffDays = diffMs / (1000 * 60 * 60 * 24);

                                                const badgeClass = diffDays < 0 ? "badge-error" : diffDays < 7 ? "badge-warning" : "badge-success";

                                                return (
                                                    <div className={`w-full badge badge-soft ${badgeClass} tooltip`} data-tip={dateFormat(value.expirationDate)}>
                                                        {/* @ts-expect-error error when using relative-time component (but working) */}
                                                        <relative-time datetime={value.expirationDate} title=""/>
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                    </article>
                                    <article role="cell" data-column={`value-${value.id}-actions`} className={`${colwidths[3]} flex gap-1 items-center`}>
                                        <button className="btn btn-ghost btn-circle btn-xs" onClick={() => {setValueIdToEdit(value.id); setOpenNewValue(true)}}>
                                            <EditIcon className="w-4" />
                                        </button>
                                        <button className="btn btn-ghost btn-circle btn-xs text-error" onClick={() => setValueIdToDelete(value.id!)}>
                                            <BinIcon className="w-4" />
                                        </button>
                                        {valueIdToDelete === value.id && (
                                            <ConfirmModalComponent key={index} open={true} onConfirm={() => deleteValue(value.id as number)} onCancel={() => {setValueIdToDelete(null)}}>
                                                <p>You are about to delete this value.</p>
                                                <p>This action cannot be undone.</p>
                                                <p>Are you sure?</p>
                                            </ConfirmModalComponent>
                                        )}
                                    </article>
                                </section>
                            ))}

                        </div>
            }
        </>
    )
}

export default ValuesTable
