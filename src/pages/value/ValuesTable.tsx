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

function ValuesTable(props: {section_id: number}) {

    const values = useValuesStore((state) => state.values);
    const setValues = useValuesStore((state) => state.setValues);

    const setValueIdToEdit = useValueStore((state) => state.setValueIdToEdit);
    const setOpenNewValue = useValueStore((state) => state.setOpenNewValue);

    const [valueIdToDelete, setValueIdToDelete] = useState<number | null>(null);

    const encryptionKey = useEncryptStore((state) => state.encryptionKey);

    const deleteValue = async (id: number) => {
        await Value.delete(id);
        setValues(props.section_id);
        setValueIdToDelete(null);
    }

    const dateFormat = (date: string) => new Date(date).toLocaleDateString('en-GB');

    return (
        <>
        {encryptionKey}
            {
                values.length === 0 
                    ?   <p className="text-gray-600">No values found.</p>
                    :   <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th className="w-2/12">Name</th>
                                        <th className="w-max">Value</th>
                                        <th className="w-0">Expiration Date</th>
                                        <th className="w-0">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {values.map((value, index) => (
                                        <tr key={index}>
                                            <th>
                                                {value.name}
                                            </th>
                                            <td>
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
                                                                <span>{value.value}</span>

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
                                            </td>
                                            <td className="whitespace-nowrap">
                                                <div className="flex gap-2 items-center">
                                                    {value.expirationDate ? (() => {
                                                        const now = new Date();
                                                        const expiration = new Date(value.expirationDate);
                                                        const diffMs = expiration.getTime() - now.getTime();
                                                        const diffDays = diffMs / (1000 * 60 * 60 * 24);

                                                        const badgeClass = diffDays < 0 ? "badge-error" : diffDays < 7 ? "badge-warning" : "badge-success";

                                                        return (
                                                            <div className={`w-full badge badge-soft ${badgeClass} tooltip`} data-tip={dateFormat(value.expirationDate)}>
                                                                {/* @ts-expect-error error when using relative-time component (but working) */}
                                                                <relative-time datetime={value.expirationDate} />
                                                            </div>
                                                        )
                                                    })() : <span className="italic text-gray-500">No expiration date</span>}
                                                </div>
                                            </td>
                                            <td className="flex gap-1 items-center">
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
            }
        </>
    )
}

export default ValuesTable
