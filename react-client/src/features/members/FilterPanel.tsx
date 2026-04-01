import type { MemberParams } from "../../types/member";
import { useState } from "react";

type Props = {
    memberParams: MemberParams;
    onSubmit: (params: MemberParams) => void;
    onClose: () => void;
};


export default function FilterPanel({ memberParams, onSubmit, onClose }: Props) {

    const [localParams, setLocalParams] = useState<MemberParams>({ ...memberParams });

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h3 className="text-lg font-bold mb-6">Select filters</h3>

                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Gender:</span>
                        <div className="flex gap-3">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="gender" value="male"
                                    checked={localParams.gender === 'male'}
                                    onChange={() => setLocalParams({ ...localParams, gender: 'male' })} />
                                Male
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="gender" value="female"
                                    checked={localParams.gender === 'female'}
                                    onChange={() => setLocalParams({ ...localParams, gender: 'female' })} />
                                Female
                            </label>
                            <button onClick={() => setLocalParams({ ...localParams, gender: undefined })} className="px-2 py-1 border rounded text-sm cursor-pointer" >
                                X
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Age: </span>
                        <div className="flex gap-3">
                            <input type="number" min={18} value={localParams.minAge}
                                onChange={e => setLocalParams({ ...localParams, minAge: Math.max(18, Number(e.target.value)) })}
                                className="border rounded px-2 py-1 w-20" />
                            <input type="number" min={localParams.minAge} value={localParams.maxAge}
                                onChange={e => setLocalParams({ ...localParams, maxAge: Number(e.target.value) })}
                                className="border rounded px-2 py-1 w-20" />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Order by:</span>
                        <select value={localParams.orderBy}
                            onChange={e => setLocalParams({ ...localParams, orderBy: e.target.value })}
                            className="border rounded px-2 py-1">
                            <option value="lastActive">Last active</option>
                            <option value="created">Newest members</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button onClick={() => onSubmit(localParams)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                        Submit
                    </button>
                </div>
            </div>

            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}